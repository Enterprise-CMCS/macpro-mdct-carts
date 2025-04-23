import { Construct } from "constructs";
import {
  aws_dynamodb as dynamodb,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_lambda_nodejs as lambda_nodejs,
  custom_resources as cr,
  CfnOutput,
  Duration,
} from "aws-cdk-lib";
import { DynamoDBTable } from "../constructs/dynamodb-table";

interface CreateDataComponentsProps {
  scope: Construct;
  stage: string;
  isDev: boolean;
  customResourceRole: iam.Role;
}

export function createDataComponents(props: CreateDataComponentsProps) {
  const {
    scope,
    stage,
    isDev,
    customResourceRole,
  } = props;

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

  const lambdaApiRole = new iam.Role(scope, "SeedDataLambdaApiRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    managedPolicies: [
      iam.ManagedPolicy.fromAwsManagedPolicyName(
        "service-role/AWSLambdaVPCAccessExecutionRole"
      ),
    ],
    inlinePolicies: {
      DynamoPolicy: new iam.PolicyDocument({
        statements: [
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
              // TODO: previous had dynamodb:BatchWriteItem
            ],
            resources: ["*"],
          }),
        ],
      }),
    },
  });

  const seedDataFunction = new lambda_nodejs.NodejsFunction(scope, "seedData", {
    entry: "services/database/handlers/seed/seed.js",
    handler: "handler",
    runtime: lambda.Runtime.NODEJS_20_X,
    timeout: Duration.seconds(900),
    memorySize: 1024,
    role: lambdaApiRole,
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
  });

  const seedDataInvoke = new cr.AwsCustomResource(
    scope,
    "InvokeSeedDataFunction",
    {
      onCreate: {
        service: "Lambda",
        action: "invoke",
        parameters: {
          FunctionName: seedDataFunction.functionName,
          InvocationType: "Event",
          Payload: JSON.stringify({}),
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `InvokeSeedDataFunction-${stage}`
        ),
      },
      onUpdate: undefined,
      onDelete: undefined,
      policy: cr.AwsCustomResourcePolicy.fromStatements([
        new iam.PolicyStatement({
          actions: ["lambda:InvokeFunction"],
          resources: [seedDataFunction.functionArn],
        }),
      ]),
      role: customResourceRole,
      resourceType: "Custom::InvokeSeedDataFunction",
    }
  );

  new CfnOutput(scope, "SeedDataFunctionName", {
    value: seedDataFunction.functionName,
  });

  seedDataInvoke.node.addDependency(seedDataFunction);

  return { tables };
}
