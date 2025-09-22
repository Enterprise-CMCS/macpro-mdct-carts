import { Construct } from "constructs";
import {
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  custom_resources as cr,
  CfnOutput,
  Duration,
  triggers,
} from "aws-cdk-lib";
import { DynamoDBTable } from "../constructs/dynamodb-table";
import { Lambda } from "../constructs/lambda";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
  customResourceRole: iam.Role;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const { scope, stage, isDev, customResourceRole } = props;

  const tables = [
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
    }).identifiers,
  ];
  const seedDataFunction = new Lambda(scope, "seedData", {
    stackName: `data-${stage}`,

    entry: "services/database/handlers/seed/seed.js",
    handler: "handler",
    timeout: Duration.seconds(900),
    additionalPolicies: [
      new iam.PolicyStatement({
        effect: iam.Effect.ALLOW,
        actions: [
          "dynamodb:DescribeTable",
          "dynamodb:Query",
          "dynamodb:Scan",
          "dynamodb:GetItem",
          "dynamodb:PutItem",
          "dynamodb:UpdateItem",
          "dynamodb:DeleteItem",
        ],
        resources: ["*"],
      }),
    ],
    memorySize: 1024,
    environment: {
      dynamoPrefix: stage,
      seedTestData: isDev.toString(),
    },
    bundling: {
      commandHooks: {
        beforeBundling(inputDir: string, outputDir: string): string[] {
          return [
            `mkdir -p ${outputDir}/data/seed/`,
            `cp -r ${inputDir}/services/database/data/seed/* ${outputDir}/data/seed/`,
          ];
        },
        afterBundling: () => [],
        beforeInstall: () => [],
      },
    },
    isDev,
  }).lambda;


  new triggers.Trigger(scope, "InvokeSeedDataFunction", {
    handler: seedDataFunction,
    invocationType: triggers.InvocationType.EVENT,
  });

  new CfnOutput(scope, "SeedDataFunctionName", {
    value: seedDataFunction.functionName,
  });

  return { tables };
}
