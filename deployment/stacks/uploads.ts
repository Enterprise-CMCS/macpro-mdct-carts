import { Construct } from "constructs";
import {
  aws_s3 as s3,
  aws_guardduty as guardduty,
  aws_iam as iam,
  RemovalPolicy,
  Aws,
} from "aws-cdk-lib";

interface CreateUploadsComponentsProps {
  scope: Construct;
  loggingBucket: s3.IBucket;
  isDev: boolean;
  attachmentsBucketName: string;
}

export function createUploadsComponents(props: CreateUploadsComponentsProps) {
  const { scope, loggingBucket, isDev, attachmentsBucketName } = props;

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

  const s3MalwareProtectionRole = new iam.Role(
    scope,
    "S3MalwareProtectionRole",
    {
      assumedBy: new iam.ServicePrincipal(
        "malware-protection-plan.guardduty.amazonaws.com"
      ),
      inlinePolicies: {
        S3MalwareProtectionPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              sid: "AllowEventBridgeManagement",
              effect: iam.Effect.ALLOW,
              actions: ["events:*"],
              resources: [
                `arn:aws:events:us-east-1:${Aws.ACCOUNT_ID}:rule/DO-NOT-DELETE-AmazonGuardDutyMalwareProtectionS3*`,
              ],
              conditions: {
                StringLike: {
                  "events:ManagedBy":
                    "malware-protection-plan.guardduty.amazonaws.com",
                },
              },
            }),
            new iam.PolicyStatement({
              sid: "AllowS3Operations",
              effect: iam.Effect.ALLOW,
              actions: [
                "s3:GetObject*",
                "s3:PutObject*",
                "s3:ListBucket",
                "s3:*Notification",
                "s3:*Tagging",
              ],
              resources: [
                attachmentsBucket.bucketArn,
                `${attachmentsBucket.bucketArn}/*`,
              ],
            }),
          ],
        }),
      },
    }
  );

  attachmentsBucket.addToResourcePolicy(
    new iam.PolicyStatement({
      actions: ["s3:GetObject"],
      effect: iam.Effect.DENY,
      resources: [`${attachmentsBucket.bucketArn}/*`],
      principals: [new iam.ArnPrincipal("*")],
      conditions: {
        StringNotEquals: {
          "s3:ExistingObjectTag/GuardDutyMalwareScanStatus": "NO_THREATS_FOUND",
          "s3:ExistingObjectTag/virusScanStatus": "CLEAN",
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

  new guardduty.CfnMalwareProtectionPlan(scope, "MalwareProtectionPlan", {
    actions: {
      tagging: {
        status: "ENABLED",
      },
    },
    protectedResource: {
      s3Bucket: {
        bucketName: attachmentsBucketName,
      },
    },
    role: s3MalwareProtectionRole.roleArn,
  });

  return attachmentsBucket;
}
