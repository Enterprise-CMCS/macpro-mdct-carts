import { Construct } from "constructs";
import {
  aws_apigateway as apigateway,
  aws_logs as logs,
  aws_s3 as s3,
  aws_wafv2 as wafv2,
  CfnOutput,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda.ts";
import { WafConstruct } from "../constructs/waf.ts";
import { isLocalStack } from "../local/util.ts";
import { DynamoDBTable } from "../constructs/dynamodb-table.ts";

interface CreateApiComponentsProps {
  docraptorApiKey: string;
  isDev: boolean;
  project: string;
  scope: Construct;
  stage: string;
  tables: DynamoDBTable[];
  attachmentsBucket: s3.IBucket;
}

export function createApiComponents(props: CreateApiComponentsProps) {
  const {
    docraptorApiKey,
    isDev,
    project,
    scope,
    stage,
    tables,
    attachmentsBucket,
  } = props;

  const service = "app-api";

  const logGroup = new logs.LogGroup(scope, "ApiAccessLogs", {
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    retention: logs.RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
  });

  const api = new apigateway.RestApi(scope, "ApiGatewayRestApi", {
    restApiName: `${stage}-${service}`,
    deploy: true,
    cloudWatchRole: false,
    deployOptions: {
      stageName: stage,
      tracingEnabled: true,
      loggingLevel: isDev
        ? apigateway.MethodLoggingLevel.OFF
        : apigateway.MethodLoggingLevel.INFO,
      dataTraceEnabled: true,
      accessLogDestination: new apigateway.LogGroupLogDestination(logGroup),
    },
    defaultCorsPreflightOptions: {
      allowOrigins: apigateway.Cors.ALL_ORIGINS,
      allowMethods: apigateway.Cors.ALL_METHODS,
    },
  });

  api.addGatewayResponse("Default4XXResponse", {
    type: apigateway.ResponseType.DEFAULT_4XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  api.addGatewayResponse("Default5XXResponse", {
    type: apigateway.ResponseType.DEFAULT_5XX,
    responseHeaders: {
      "Access-Control-Allow-Origin": "'*'",
      "Access-Control-Allow-Headers": "'*'",
    },
  });

  const environment = {
    STAGE: stage,
    docraptorApiKey,
    attachmentsBucketName: attachmentsBucket.bucketName,
    NODE_OPTIONS: "--enable-source-maps",
    ...Object.fromEntries(
      tables.map((table) => [`${table.node.id}Table`, table.table.tableName])
    ),
    ...(isLocalStack && { AWS_ENDPOINT_URL: process.env.AWS_ENDPOINT_URL }),
  };

  const commonProps = {
    stackName: `${service}-${stage}`,
    api,
    environment,
    isDev,
    tables,
    buckets: [attachmentsBucket],
  };

  new Lambda(scope, "getStates", {
    entry: "services/app-api/handlers/state/get.ts",
    handler: "getStates",
    path: "/state",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "getEnrollmentCounts", {
    entry: "services/app-api/handlers/enrollmentCounts/get.ts",
    handler: "getEnrollmentCounts",
    path: "/enrollment_counts/{year}/{state}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "getStateStatus", {
    entry: "services/app-api/handlers/stateStatus/get.ts",
    handler: "getStateStatus",
    path: "/state_status",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "updateStateStatus", {
    entry: "services/app-api/handlers/stateStatus/update.ts",
    handler: "updateStateStatus",
    path: "/state_status/{year}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "getSections", {
    entry: "services/app-api/handlers/section/get.ts",
    handler: "getSections",
    path: "/section/{year}/{state}",
    method: "GET",
    ...commonProps,
  });

  new Lambda(scope, "updateSections", {
    entry: "services/app-api/handlers/section/update.ts",
    handler: "updateSections",
    path: "/save_report/{year}/{state}",
    method: "PUT",
    ...commonProps,
  });

  new Lambda(scope, "generateFormTemplates", {
    entry: "services/app-api/handlers/formTemplates/post.ts",
    handler: "post",
    path: "/formTemplates",
    method: "POST",
    timeout: Duration.seconds(30),
    ...commonProps,
  });

  new Lambda(scope, "postUpload", {
    entry: "services/app-api/handlers/uploads/createUploadPsUrl.ts",
    handler: "psUpload",
    path: "/psUrlUpload/{year}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "postDownload", {
    entry: "services/app-api/handlers/uploads/createDownloadPsUrl.ts",
    handler: "getSignedFileUrl",
    path: "/psUrlDownload/{year}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "deleteUpload", {
    entry: "services/app-api/handlers/uploads/delete.ts",
    handler: "deleteUpload",
    path: "/uploads/{year}/{state}/{fileId}",
    method: "DELETE",
    ...commonProps,
  });

  new Lambda(scope, "viewUploads", {
    entry: "services/app-api/handlers/uploads/viewUploaded.ts",
    handler: "viewUploaded",
    path: "/uploads/{year}/{state}",
    method: "POST",
    ...commonProps,
  });

  new Lambda(scope, "printPdf", {
    entry: "services/app-api/handlers/printing/printPdf.ts",
    handler: "print",
    path: "/print_pdf",
    method: "POST",
    timeout: Duration.seconds(30),
    ...commonProps,
  });

  if (!isLocalStack) {
    const waf = new WafConstruct(
      scope,
      "ApiWafConstruct",
      {
        name: `${project}-${service}-${stage}-webacl-waf`,
        blockRequestBodyOver8KB: false,
      },
      "REGIONAL"
    );

    new wafv2.CfnWebACLAssociation(scope, "WebACLAssociation", {
      resourceArn: api.deploymentStage.stageArn,
      webAclArn: waf.webAcl.attrArn,
    });
  }

  const apiGatewayRestApiUrl = api.url.slice(0, -1);

  new CfnOutput(scope, "ApiUrl", {
    value: apiGatewayRestApiUrl,
  });

  return {
    restApiId: api.restApiId,
    apiGatewayRestApiUrl,
  };
}
