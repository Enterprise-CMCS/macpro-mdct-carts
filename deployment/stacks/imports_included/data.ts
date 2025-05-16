import { Construct } from "constructs";
import { aws_dynamodb as dynamodb } from "aws-cdk-lib";
import { DynamoDBTable } from "../../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev } = props;

  new DynamoDBTable(scope, "Acs", {
    stage,
    isDev,
    name: "acs",
    partitionKey: { name: "stateId", type: dynamodb.AttributeType.STRING },
    sortKey: { name: "year", type: dynamodb.AttributeType.NUMBER },
  }).identifiers,
    new DynamoDBTable(scope, "Fmap", {
      stage,
      isDev,
      name: "fmap",
      partitionKey: { name: "fiscalYear", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "stateId", type: dynamodb.AttributeType.STRING },
    }).identifiers,
    new DynamoDBTable(scope, "State", {
      stage,
      isDev,
      name: "state",
      partitionKey: { name: "code", type: dynamodb.AttributeType.STRING },
    }).identifiers,
    new DynamoDBTable(scope, "StateStatus", {
      stage,
      isDev,
      name: "state-status",
      partitionKey: { name: "stateId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "year", type: dynamodb.AttributeType.NUMBER },
    }).identifiers,
    new DynamoDBTable(scope, "Section", {
      stage,
      isDev,
      name: "section",
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "sectionId", type: dynamodb.AttributeType.NUMBER },
    }).identifiers,
    new DynamoDBTable(scope, "SectionBase", {
      stage,
      isDev,
      name: "section-base",
      partitionKey: { name: "year", type: dynamodb.AttributeType.NUMBER },
      sortKey: { name: "sectionId", type: dynamodb.AttributeType.NUMBER },
    }).identifiers,
    new DynamoDBTable(scope, "StageEnrollmentCounts", {
      stage,
      isDev,
      name: "stg-enrollment-counts",
      partitionKey: { name: "pk", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "entryKey", type: dynamodb.AttributeType.STRING },
    }).identifiers,
    new DynamoDBTable(scope, "Uploads", {
      stage,
      isDev,
      name: "uploads",
      partitionKey: {
        name: "uploadedState",
        type: dynamodb.AttributeType.STRING,
      },
      sortKey: { name: "fileId", type: dynamodb.AttributeType.STRING },
    }).identifiers;
}
