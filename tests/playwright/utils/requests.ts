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
    "x-api-key": getIdToken(storageStatePath),
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
