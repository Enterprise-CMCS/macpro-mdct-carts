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
  contents: object;
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

export const enum UserRoles {
  APPROVER = "mdctcarts-approver",
  BUSINESS_OWNER_REP = "mdctcarts-bor",
  HELP = "mdctcarts-help-desk",
  STATE = "mdctcarts-state-user",
  PROJECT_OFFICER = "mdctcarts-project-officer",
}

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}
/* eslint-enable no-unused-vars */
