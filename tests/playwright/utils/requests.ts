import { request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import * as aws4 from "aws4";
import { STATE_USER_AUTH } from "./constants";
import * as crypto from "node:crypto";

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

/**
 * Extracts the Cognito ID token from a stored auth session. The backend reads
 * this JWT from the "x-api-key" header to identify the user.
 */
export function getIdToken(storageStatePath: string = STATE_USER_AUTH): string {
  const resolvedPath = path.isAbsolute(storageStatePath)
    ? storageStatePath
    : path.resolve(__dirname, "..", storageStatePath);
  const session = JSON.parse(fs.readFileSync(resolvedPath, "utf8"));
  const localStorage = session.origins?.[0]?.localStorage ?? [];
  const idToken = localStorage.find((item: { name: string }) =>
    item.name.endsWith(".idToken")
  );
  if (!idToken) {
    throw new Error(
      `No Cognito ID token found in ${resolvedPath}. Run the auth setup first.`
    );
  }
  return idToken.value;
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

export interface RawApiResponse<T = any> {
  status: number;
  statusText: string;
  body: T;
  rawText: string;
}

async function executeSignedRequest<T = any>(
  method: HttpMethod,
  apiPath: string,
  token: string,
  body?: unknown
): Promise<RawApiResponse<T>> {
  const { apiUrl, region } = await loadEnvConfig();
  const endpoint = apiUrl + apiPath;

  const bodyString =
    (method === "POST" || method === "PUT") && body !== undefined
      ? JSON.stringify(body)
      : undefined;

  // Token is set BEFORE SigV4 signing so API Gateway includes x-api-key in SignedHeaders
  let headers: Record<string, string> = {
    "x-api-key": token,
  };
  if (bodyString !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  // LocalStack doesn't enforce IAM auth but the deployed API Gateway does
  const isLocalStack = new URL(apiUrl).host.includes("localstack");
  if (!isLocalStack) {
    headers = signHeaders(endpoint, region, method, headers, bodyString);
  }

  const context = await request.newContext({ extraHTTPHeaders: headers });
  try {
    const response = await context.fetch(endpoint, {
      method,
      headers,
      data: bodyString,
    });

    const rawText = await response.text();
    let parsedBody: any = null;
    if (rawText.length > 0) {
      try {
        parsedBody = JSON.parse(rawText);
      } catch {
        parsedBody = rawText;
      }
    }

    return {
      status: response.status(),
      statusText: response.statusText(),
      body: parsedBody,
      rawText,
    };
  } finally {
    await context.dispose();
  }
}

export async function authenticatedRawRequest<T = any>(
  method: HttpMethod,
  apiPath: string,
  body?: unknown,
  storageStatePath: string = STATE_USER_AUTH
): Promise<RawApiResponse<T>> {
  const validToken = getIdToken(storageStatePath);
  return executeSignedRequest<T>(method, apiPath, validToken, body);
}

export function buildForgedJwt(
  state: string = "TX",
  role: string = "mdctcarts-project-officer",
  storageStatePath: string = STATE_USER_AUTH,
  expiration: number = 9999999999
): string {
  // Pulls the real issuer for the active test environment from the saved token
  const realToken = getIdToken(storageStatePath);
  const realPayload = JSON.parse(
    Buffer.from(realToken.split(".")[1], "base64url").toString("utf8")
  );

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload = {
    "cognito:username": "retest-forge-user",
    "custom:cms_roles": role,
    "custom:cms_state": state,
    email: "retest-user@example.com",
    iss: realPayload.iss,
    exp: expiration,
  };

  const encodedHeader = Buffer.from(JSON.stringify(header)).toString(
    "base64url"
  );
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );
  const fakeSignature = crypto
    .createHash("sha256")
    .update("fake_secret")
    .digest("base64url");

  return `${encodedHeader}.${encodedPayload}.${fakeSignature}`;
}

export async function requestWithCustomToken<T = any>(
  method: HttpMethod,
  apiPath: string,
  customToken: string,
  body?: unknown
): Promise<RawApiResponse<T>> {
  return executeSignedRequest<T>(method, apiPath, customToken, body);
}

export async function authenticatedRequest<T = any>(
  method: HttpMethod,
  apiPath: string,
  body?: unknown,
  storageStatePath: string = STATE_USER_AUTH
): Promise<T> {
  const res = await authenticatedRawRequest<T>(
    method,
    apiPath,
    body,
    storageStatePath
  );

  if (res.status < 200 || res.status >= 300) {
    throw new Error(
      `API request failed: ${method} ${apiPath} -> ${res.status} ${res.statusText} ${res.rawText}`
    );
  }

  return res.body;
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
