import { Construct } from "constructs";
import { aws_s3 as s3, RemovalPolicy, Aws } from "aws-cdk-lib";

interface CreateUploadsComponentsProps {
  scope: Construct;
  stage: string;
  loggingBucket: s3.IBucket;
  isDev: boolean;
}

export function createUploadsComponents(props: CreateUploadsComponentsProps) {
  const { scope, stage, loggingBucket, isDev } = props;
  const service = "uploads";

  new s3.Bucket(scope, "AttachmentsBucket", {
    bucketName: `${service}-${stage}-attachments-${Aws.ACCOUNT_ID}`,
    autoDeleteObjects: isDev,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
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

  new s3.Bucket(scope, "FiscalYearTemplateBucket", {
    bucketName: `${service}-${stage}-carts-download-${Aws.ACCOUNT_ID}`,
    encryption: s3.BucketEncryption.S3_MANAGED,
    versioned: true,
    removalPolicy: RemovalPolicy.RETAIN,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    cors: [
      {
        allowedOrigins: ["*"],
        allowedMethods: [s3.HttpMethods.GET],
        allowedHeaders: ["*"],
        exposedHeaders: ["ETag"],
        maxAge: 3000,
      },
    ],
    enforceSSL: true,
    serverAccessLogsBucket: loggingBucket,
    serverAccessLogsPrefix: `AWSLogs/${Aws.ACCOUNT_ID}/s3/`,
  });
}
