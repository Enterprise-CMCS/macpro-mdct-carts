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

export interface StateStatus {
  year: number;
  status: string;
  stateId: string;
  username?: string;
  lastChanged?: string;
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

export interface DynamoDelete {
  TableName: string;
  Key: {
    compoundKey: string;
    coreSet: string;
  };
}

export interface DynamoUpdate {
  TableName: string;
  Key: {
    compoundKey: string;
    coreSet: string;
  };
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
  ADMIN = "mdctcarts-approver",
  STATE = "mdctcarts-state-user",
  HELP = "mdctcarts-help-desk",
  BO = "mdctcarts-bo-user",
  BOR = "mdctcarts-bor",
  CO = "mdctcarts-co",
}

export const enum RequestMethods {
  POST = "POST",
  GET = "GET",
  PUT = "PUT",
  DELETE = "DELETE",
}
/* eslint-enable no-unused-vars */
