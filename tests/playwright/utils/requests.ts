import { request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import * as aws4 from "aws4";
import { STATE_USER_AUTH } from "./constants";

interface EnvConfig {
  apiUrl: string;
  region: string;
}

let cachedEnvConfig: EnvConfig | undefined;

/**
 * Reads the UI env-config over HTTP from BASE_URL.
 *
 * `env-config.js` is served as a static asset by both the local dev server and
 * the deployed site (the filesystem copy only exists locally). A pre-set
 * API_URL env var takes precedence for the URL.
 */
async function loadEnvConfig(): Promise<EnvConfig> {
  if (cachedEnvConfig) return cachedEnvConfig;

  const baseUrl = (process.env.BASE_URL || "http://localhost:3000").replace(
    /\/$/,
    ""
  );
  const envConfigUrl = `${baseUrl}/env-config.js`;
  const context = await request.newContext();
  const response = await context.get(envConfigUrl);
  const contents = await response.text();
  await context.dispose();

  const read = (key: string) =>
    contents.match(new RegExp(`${key}:\\s*"([^"]+)"`))?.[1];

  const apiUrl = process.env.API_URL || read("API_URL");
  if (!apiUrl) {
    throw new Error(`Could not find API_URL in ${envConfigUrl}`);
  }

  cachedEnvConfig = {
    apiUrl,
    region: read("API_REGION") || read("COGNITO_REGION") || "us-east-1",
  };
  return cachedEnvConfig;
}

export async function getApiUrl(): Promise<string> {
  return (await loadEnvConfig()).apiUrl;
}

const TOKEN_EXPIRY_BUFFER_SECONDS = 60;

/**
 * Refreshes by session file. Storing the promise lets parallel requests share
 * one.
 */
const tokenRefreshes = new Map<string, Promise<string>>();

interface StoredSession {
  idToken: string;
  refreshToken?: string;
  clientId: string;
}

/**
 * Reads the Cognito tokens Amplify saved to localStorage during auth setup.
 * Keys look like "CognitoIdentityServiceProvider.<clientId>.<username>.idToken".
 */
function readStoredSession(storageStatePath: string): StoredSession {
  const resolvedPath = path.isAbsolute(storageStatePath)
    ? storageStatePath
    : path.resolve(__dirname, "..", storageStatePath);
  const session = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  const items: { name: string; value: string }[] =
    session.origins?.[0]?.localStorage ?? [];
  const idTokenItem = items.find((item) => item.name.endsWith(".idToken"));
  if (!idTokenItem) {
    throw new Error(
      `No Cognito ID token found in ${resolvedPath}. Run the auth setup first.`
    );
  }
  const keyPrefix = idTokenItem.name.slice(0, -".idToken".length);
  return {
    idToken: idTokenItem.value,
    refreshToken: items.find(
      (item) => item.name === `${keyPrefix}.refreshToken`
    )?.value,
    clientId: keyPrefix.split(".")[1],
  };
}

/** Unverified decode is fine for our own token; unreadable = expired */
function isExpiringSoon(jwt: string): boolean {
  let exp: unknown;
  try {
    const payload = Buffer.from(jwt.split(".")[1] ?? "", "base64url");
    exp = JSON.parse(payload.toString("utf8")).exp;
  } catch {
    // Unreadable: treated as expired below
  }
  return (
    typeof exp !== "number" ||
    exp - Date.now() / 1000 < TOKEN_EXPIRY_BUFFER_SECONDS
  );
}

/** Trades the stored refresh token for a new ID token, as Amplify would */
async function refreshIdToken(
  session: StoredSession,
  region: string
): Promise<string> {
  if (!session.refreshToken) {
    throw new Error(
      "Stored ID token is expired or unreadable, and there is no refresh token. Run the auth setup again."
    );
  }
  const response = await fetch(`https://cognito-idp.${region}.amazonaws.com/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-amz-json-1.1",
      "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
    },
    body: JSON.stringify({
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: session.clientId,
      AuthParameters: { REFRESH_TOKEN: session.refreshToken },
    }),
  });
  if (!response.ok) {
    throw new Error(
      `Cognito token refresh failed: ${response.status} ${await response.text()}`
    );
  }
  const body = await response.json();
  const idToken = body.AuthenticationResult?.IdToken;
  if (typeof idToken !== "string") {
    const challenge = body.ChallengeName
      ? ` (challenge: ${body.ChallengeName})`
      : "";
    throw new Error(
      `Cognito token refresh returned no ID token${challenge}. Run the auth setup again.`
    );
  }
  return idToken;
}

/** An unexpired ID token for the session; the API rejects expired ones */
export async function getIdToken(
  storageStatePath: string = STATE_USER_AUTH
): Promise<string> {
  for (;;) {
    const existing = tokenRefreshes.get(storageStatePath);
    if (existing) {
      const token = await existing;
      if (!isExpiringSoon(token)) return token;
      // Another caller may have started a newer refresh meanwhile
      if (tokenRefreshes.get(storageStatePath) !== existing) continue;
    }

    const session = readStoredSession(storageStatePath);
    if (!isExpiringSoon(session.idToken)) return session.idToken;

    // Register before awaiting so parallel callers share it
    const refresh = loadEnvConfig().then(({ region }) =>
      refreshIdToken(session, region)
    );
    tokenRefreshes.set(storageStatePath, refresh);
    // Forget failures so the next call retries
    refresh.catch(() => {
      if (tokenRefreshes.get(storageStatePath) === refresh) {
        tokenRefreshes.delete(storageStatePath);
      }
    });
    return refresh;
  }
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

/**
 * Signs a request with AWS SigV4. Deployed API Gateway methods use IAM
 * authorization, so requests must be signed with the CI job's AWS credentials.
 */
function signHeaders(
  endpoint: string,
  region: string,
  method: HttpMethod,
  headers: Record<string, string>,
  body?: string
): Record<string, string> {
  const url = new URL(endpoint);
  const signed = aws4.sign(
    {
      service: "execute-api",
      region,
      method,
      host: url.host,
      path: url.pathname + url.search,
      headers: { ...headers, Host: url.host },
      body: body ?? "",
    },
    {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      sessionToken: process.env.AWS_SESSION_TOKEN,
    }
  );

  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(signed.headers ?? {})) {
    result[key] = String(value);
  }
  return result;
}

async function authenticatedRequest(
  method: HttpMethod,
  apiPath: string,
  body?: unknown,
  storageStatePath: string = STATE_USER_AUTH
): Promise<any> {
  const { apiUrl, region } = await loadEnvConfig();
  const endpoint = apiUrl + apiPath;

  const bodyString =
    (method === "POST" || method === "PUT") && body !== undefined
      ? JSON.stringify(body)
      : undefined;

  let headers: Record<string, string> = {
    "x-api-key": await getIdToken(storageStatePath),
  };
  if (bodyString !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // LocalStack doesn't enforce IAM auth; the deployed API Gateway does.
  const isLocalStack = new URL(apiUrl).host.includes("localstack");
  if (!isLocalStack) {
    headers = signHeaders(endpoint, region, method, headers, bodyString);
  }

  const context = await request.newContext({ extraHTTPHeaders: headers });
  const options =
    bodyString !== undefined ? { headers, data: bodyString } : { headers };

  let response;
  switch (method) {
    case "GET":
      response = await context.get(endpoint, { headers });
      break;
    case "POST":
      response = await context.post(endpoint, options);
      break;
    case "PUT":
      response = await context.put(endpoint, options);
      break;
    case "DELETE":
      response = await context.delete(endpoint, { headers });
      break;
  }

  if (!response.ok()) {
    const text = await response.text();
    await context.dispose();
    throw new Error(
      `API request failed: ${method} ${endpoint} -> ${response.status()} ${response.statusText()} ${text}`
    );
  }

  const text = await response.text();
  await context.dispose();
  return text.length > 0 ? JSON.parse(text) : null;
}

export interface ReportStatus {
  year: number;
  stateId: string;
  status: string;
  programType?: string;
  archived?: boolean;
}

/** Report sections are stored one DynamoDB item per section. */
export type ReportSection = {
  pk: string;
  sectionId: number;
  year: number;
  stateId: string;
  contents: any;
  [key: string]: any;
};

export async function getReportStatuses(
  storageStatePath?: string
): Promise<ReportStatus[]> {
  const response = await authenticatedRequest(
    "GET",
    "/state_status",
    undefined,
    storageStatePath
  );
  return response?.Items ?? [];
}

/**
 * Sets the status of a report. State users may update their own state's
 * reports, which lets tests reset a certified report back to in progress.
 */
export async function updateReportStatus(
  year: number,
  state: string,
  status: string,
  username: string,
  storageStatePath?: string
): Promise<void> {
  await authenticatedRequest(
    "POST",
    `/state_status/${year}/${state}`,
    { status, username },
    storageStatePath
  );
}

export async function getReport(
  year: number,
  state: string,
  storageStatePath?: string
): Promise<ReportSection[]> {
  return authenticatedRequest(
    "GET",
    `/section/${year}/${state}`,
    undefined,
    storageStatePath
  );
}

export async function saveReport(
  year: number,
  state: string,
  sections: ReportSection[],
  storageStatePath?: string
): Promise<void> {
  await authenticatedRequest(
    "PUT",
    `/save_report/${year}/${state}`,
    sections,
    storageStatePath
  );
}
