export interface Measure {
  compoundKey: string;
  coreSet: CoreSetAbbr;
  createdAt: number;
  description: string;
  lastAltered: number;
  lastAlteredBy?: string;
  measure: string;
  state: string;
  status: MeasureStatus;
  year: number;
}

export interface DynamoMeasureList {
  Items?: Measure[];
  Count?: number;
  ScannedCount?: number;
}

export interface State {
  code: string;
  programType: string;
  name: string;
  programNames?: any;
}

export interface AcsData {
  numberUninsuredMoe: number;
  percentUninsured: number;
  year: number;
  percentageUninsuredMoe: number;
  stateId: string;
  numberUninsured: number;
}

export interface FmapData {
  enhancedFmap: number;
  fiscalYear: number;
  stateId: string;
}

export interface StateStatus {
  year: number;
  status: string;
  stateId: string;
  programType?: string;
  username?: string;
  lastChanged?: string;
}

export interface Section {
  pk: string;
  year: number;
  stateId: string;
  sectionId: number;
  /** contents contains sections, which have further sub-objects */
  contents: Record<string, any>;
  /** This is a date, formatted with `new Date().toString()` */
  lastChanged: string;
}

export interface DynamoStateStatusList {
  Items?: StateStatus[];
  Count?: number;
  ScannedCount?: number;
}
export interface DynamoCreate {
  TableName: string;
  Item: Measure;
}

export interface DynamoBatchWrite {
  RequestItems: { [key: string]: Array<any> };
}

export interface DynamoDelete {
  TableName: string;
  Key: { [key: string]: any };
}

export interface DynamoUpdate {
  TableName: string;
  Key: { [key: string]: any };
  UpdateExpression?: string;
  ExpressionAttributeNames: { [key: string]: string };
  ExpressionAttributeValues: { [key: string]: any };
}

export interface DynamoScan {
  TableName: string;
  FilterExpression?: string;
  ExpressionAttributeNames?: { [key: string]: string };
  ExpressionAttributeValues?: { [key: string]: any };
  ExclusiveStartKey?: any;
}

export interface DynamoFetch {
  TableName: string;
  Key: {
    [key: string]: string | number;
  };
}

/* eslint-disable no-unused-vars */
export const enum CoreSetAbbr {
  ACS = "ACS", // adult
  CCS = "CCS", // child combined
  CCSM = "CCSM", // child medicaid
  CCSC = "CCSC", // child chip
  HHCS = "HHCS", // helth homes
}

export const enum MeasureStatus {
  COMPLETE = "complete",
  INCOMPLETE = "incomplete",
}

/*
 * Roles directly from IDM, their names do not 1:1 match with expected behavior
 */
export const enum IdmRoles {
  APPROVER = "mdctcarts-approver",
  BUSINESS_OWNER_REP = "mdctcarts-bor",
  INTERNAL = "mdctcarts-internal-user",
  HELP = "mdctcarts-help-desk",
  STATE = "mdctcarts-state-user",
  PROJECT_OFFICER = "mdctcarts-project-officer",
}

/*
 * Carts App roles, naming conveying an expected behavior
 */
export const enum AppRoles {
  CMS_USER = "CMS_USER", // User who can view and reject state submissions
  CMS_ADMIN = "CMS_ADMIN", // Biz Owner - View all, release forms
  CMS_APPROVER = "CMS_APPROVER", // Approver - view and uncertify
  INTERNAL_USER = "INTERNAL_USER", // Internal User - View all
  HELP_DESK = "HELP_DESK", // Help Desk - View all
  STATE_USER = "STATE_USER", // Enter and certifies data for a year
}

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}

/**
 * Preseving historic filenames in case we need to make them available on demand or switch between available forms.
 */
interface ReportPdfsInterface {
  [key: string]: string;
}

export const ReportPdfs: ReportPdfsInterface = {
  2021: "FFY_2021_CARTS_Template.pdf",
  2022: "FFY_2022_CARTS_Template.pdf",
  2023: "FFY_2023_CARTS_Template.pdf",
  2024: "FFY_2024_CARTS_Template.pdf",
  2025: "FFY_2025_CARTS_Template.pdf",
};
/* eslint-enable no-unused-vars */

/**
 * Abridged copy of the type used by `aws-lambda@1.0.7` (from `@types/aws-lambda@8.10.88`)
 * We only use this one type from the package, and we use only a subset of the
 * properties. Since `aws-lambda` depends on `aws-sdk` (that is, SDK v2),
 * we can save ourselves a big dependency with this small redundancy.
 */
export interface APIGatewayProxyEvent {
  body: string | null;
  headers: Record<string, string | undefined>;
  multiValueHeaders: Record<string, string | undefined>;
  httpMethod: string;
  isBase64Encoded: boolean;
  path: string;
  pathParameters: Record<string, string | undefined> | null;
  queryStringParameters: Record<string, string | undefined> | null;
  multiValueQueryStringParameters: Record<string, string | undefined> | null;
  stageVariables: Record<string, string | undefined> | null;
  /** The context is complicated, and we don't (as of 2023) use it at all. */
  requestContext: any;
  resource: string;
}
