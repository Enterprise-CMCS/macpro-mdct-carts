import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_lambda as lambda,
  aws_s3_notifications as s3notifications,
  aws_iam as iam,
  aws_events as events,
  aws_events_targets as eventstargets,
  Duration,
  RemovalPolicy,
  Aws,
  CfnOutput,
} from "aws-cdk-lib";
import { Lambda } from "../constructs/lambda";

interface CreateUploadsComponentsProps {
  scope: Construct;
  stage: string;
  loggingBucket: s3.IBucket;
  isDev: boolean;
  attachmentsBucketName: string;
}

export function createUploadsComponents(props: CreateUploadsComponentsProps) {
  const { scope, stage, loggingBucket, isDev, attachmentsBucketName } = props;
  const service = "uploads";

  const attachmentsBucket = new s3.Bucket(scope, "AttachmentsBucket", {
    bucketName: attachmentsBucketName,
    autoDeleteObjects: isDev,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    publicReadAccess: false,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [
          s3.HttpMethods.GET,
          s3.HttpMethods.PUT,
          s3.HttpMethods.POST,
          s3.HttpMethods.DELETE,
          s3.HttpMethods.HEAD,
        ],
        allowedHeaders: ["*"],
        exposedHeaders: ["ETag"],
        maxAge: 3000, // 50 minutes
      },
    ],
    enforceSSL: true,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
  });

  const clamDefsBucket = new s3.Bucket(scope, "ClamDefsBucket", {
    bucketName: `${service}-${stage}-avscan-${Aws.ACCOUNT_ID}`,
    autoDeleteObjects: isDev,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    accessControl: s3.BucketAccessControl.PRIVATE,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
  });

  const commonLambdaProps = {
    stackName: `${service}-${stage}`,
    additionalPolicies: [
      new iam.PolicyStatement({
        actions: [
          "s3:GetObject",
          "s3:GetObjectTagging",
          "s3:PutObject",
          "s3:PutObjectAcl",
          "s3:PutObjectTagging",
          "s3:PutObjectVersionTagging",
        ],
        resources: [
          `${attachmentsBucket.bucketArn}/*`,
          `${clamDefsBucket.bucketArn}/*`,
        ],
      }),
      new iam.PolicyStatement({
        actions: ["s3:ListBucket"],
        resources: [attachmentsBucket.bucketArn, clamDefsBucket.bucketArn],
      }),
    ],
    environment: {
      CLAMAV_BUCKET_NAME: clamDefsBucket.bucketName,
      PATH_TO_AV_DEFINITIONS: "lambda/s3-antivirus/av-definitions",
    },
  };

  const clamAvLayer = new lambda.LayerVersion(scope, "ClamAvLayer", {
    layerVersionName: `${service}-${stage}-clamDefs`,
    code: lambda.Code.fromAsset("services/uploads/lambda_layer.zip"),
    compatibleRuntimes: [lambda.Runtime.NODEJS_20_X],
  });

  const avScanLambda = new Lambda(scope, "AvScanLambda", {
    entry: "services/uploads/src/antivirus.js",
    handler: "lambdaHandleEvent",
    memorySize: 3008,
    timeout: Duration.seconds(300),
    layers: [clamAvLayer],
    ...commonLambdaProps,
  }).lambda;

  const avDownloadDefinitionsLambda = new Lambda(
    scope,
    "AvDownloadDefinitionsLambda",
    {
      entry: "services/uploads/src/download-definitions.js",
      handler: "lambdaHandleEvent",
      memorySize: 3072,
      timeout: Duration.seconds(300),
      layers: [clamAvLayer],
      ...commonLambdaProps,
    }
  ).lambda;

  attachmentsBucket.addEventNotification(
    s3.EventType.OBJECT_CREATED,
    new s3notifications.LambdaDestination(avScanLambda)
  );

  attachmentsBucket.addToResourcePolicy(
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.DENY,
      resources: [`${attachmentsBucket.bucketArn}/*`],
      principals: [new iam.ArnPrincipal("*")],
      conditions: {
        StringNotEquals: {
          "s3:ExistingObjectTag/virusScanStatus": "CLEAN",
          "aws:PrincipalArn": avScanLambda.role?.roleArn,
        },
      },
    })
  );

  attachmentsBucket.addToResourcePolicy(
    new iam.PolicyStatement({
      actions: ["s3:PutObject"],
      effect: iam.Effect.DENY,
      principals: [new iam.ArnPrincipal("*")],
      notResources: [
        `${attachmentsBucket.bucketArn}/*.jpg`,
        `${attachmentsBucket.bucketArn}/*.png`,
        `${attachmentsBucket.bucketArn}/*.gif`,
        `${attachmentsBucket.bucketArn}/*.jpeg`,
        `${attachmentsBucket.bucketArn}/*.bmp`,
        `${attachmentsBucket.bucketArn}/*.csv`,
        `${attachmentsBucket.bucketArn}/*.doc`,
        `${attachmentsBucket.bucketArn}/*.docx`,
        `${attachmentsBucket.bucketArn}/*.odp`,
        `${attachmentsBucket.bucketArn}/*.ods`,
        `${attachmentsBucket.bucketArn}/*.odt`,
        `${attachmentsBucket.bucketArn}/*.pdf`,
        `${attachmentsBucket.bucketArn}/*.ppt`,
        `${attachmentsBucket.bucketArn}/*.pptx`,
        `${attachmentsBucket.bucketArn}/*.rtf`,
        `${attachmentsBucket.bucketArn}/*.tif`,
        `${attachmentsBucket.bucketArn}/*.tiff`,
        `${attachmentsBucket.bucketArn}/*.txt`,
        `${attachmentsBucket.bucketArn}/*.xls`,
        `${attachmentsBucket.bucketArn}/*.xlsx`,
        `${attachmentsBucket.bucketArn}/*.json`,
      ],
    })
  );

  new events.Rule(scope, `schedule-av-download-definitions`, {
    schedule: events.Schedule.cron({ minute: "15", hour: "1" }),
    targets: [
      new eventstargets.LambdaFunction(avDownloadDefinitionsLambda, {
        retryAttempts: 2,
      }),
    ],
  });

  new CfnOutput(scope, "AttachmentsBucketName", {
    value: attachmentsBucket.bucketName,
  });

  return {
    attachmentsBucket,
  };
}
