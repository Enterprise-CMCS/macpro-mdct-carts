import { request } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";
import { STATE_USER_AUTH } from "./constants";

/**
 * Resolves the local API base URL.
 *
 * When running against LocalStack the API id changes on every deploy, so we
 * read it from the UI env-config file that `./run local` generates. A
 * pre-set API_URL env var (e.g. in CI) takes precedence.
 */
export function getApiUrl(): string {
  if (process.env.API_URL) return process.env.API_URL;

  const envConfigPath = path.resolve(
    __dirname,
    "../../../services/ui-src/public/env-config.js",
  );
  const contents = fs.readFileSync(envConfigPath, "utf8");
  const match = contents.match(/API_URL:\s*"([^"]+)"/);
  if (!match) {
    throw new Error(
      `Could not find API_URL in ${envConfigPath}. Start the app with "./run local" first.`,
    );
  }
  return match[1];
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
    item.name.endsWith(".idToken"),
  );
  if (!idToken) {
    throw new Error(
      `No Cognito ID token found in ${resolvedPath}. Run the auth setup first.`,
    );
  }
  return idToken.value;
}

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

async function authenticatedRequest(
  method: HttpMethod,
  apiPath: string,
  body?: unknown,
  storageStatePath: string = STATE_USER_AUTH,
): Promise<any> {
  const endpoint = getApiUrl() + apiPath;
  const context = await request.newContext({
    extraHTTPHeaders: { "x-api-key": getIdToken(storageStatePath) },
  });

  const options = body !== undefined ? { data: body } : {};

  let response;
  switch (method) {
    case "GET":
      response = await context.get(endpoint);
      break;
    case "POST":
      response = await context.post(endpoint, options);
      break;
    case "PUT":
      response = await context.put(endpoint, options);
      break;
    case "DELETE":
      response = await context.delete(endpoint);
      break;
  }

  if (!response.ok()) {
    const text = await response.text();
    await context.dispose();
    throw new Error(
      `API request failed: ${method} ${endpoint} -> ${response.status()} ${response.statusText()} ${text}`,
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
  storageStatePath?: string,
): Promise<ReportStatus[]> {
  const response = await authenticatedRequest(
    "GET",
    "/state_status",
    undefined,
    storageStatePath,
  );
  return response?.Items ?? [];
}

export async function getReport(
  year: number,
  state: string,
  storageStatePath?: string,
): Promise<ReportSection[]> {
  return authenticatedRequest(
    "GET",
    `/section/${year}/${state}`,
    undefined,
    storageStatePath,
  );
}

export async function saveReport(
  year: number,
  state: string,
  sections: ReportSection[],
  storageStatePath?: string,
): Promise<void> {
  await authenticatedRequest(
    "PUT",
    `/save_report/${year}/${state}`,
    sections,
    storageStatePath,
  );
}
