import {
  aws_ec2 as ec2,
  aws_s3 as s3,
  custom_resources as cr,
  CfnOutput,
  RemovalPolicy,
  Stack,
} from "aws-cdk-lib";
import {
  loadPrinceAssetMeta,
  princeAssetBucketName,
} from "./utils/prince-asset.ts";

export function addAdditionalPrerequisites(stack: Stack, vpc: ec2.IVpc): void {
  // Enable DNS hostnames on the VPC using a custom resource
  const enableDnsHostnames = new cr.AwsCustomResource(
    stack,
    "EnableDnsHostnames",
    {
      onCreate: {
        service: "EC2",
        action: "modifyVpcAttribute",
        parameters: {
          VpcId: vpc.vpcId,
          EnableDnsHostnames: { Value: true },
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `enable-dns-hostnames-${vpc.vpcId}`
        ),
      },
      policy: cr.AwsCustomResourcePolicy.fromSdkCalls({
        resources: [
          `arn:aws:ec2:${stack.region}:${stack.account}:vpc/${vpc.vpcId}`,
        ],
      }),
    }
  );

  vpc.addGatewayEndpoint("DynamoDbEndpoint", {
    service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
  });

  const lambdaEndpoint = vpc.addInterfaceEndpoint("LambdaEndpoint", {
    service: ec2.InterfaceVpcEndpointAwsService.LAMBDA,
    privateDnsEnabled: true,
  });
  lambdaEndpoint.node.addDependency(enableDnsHostnames);

  const stsEndpoint = vpc.addInterfaceEndpoint("StsEndpoint", {
    service: ec2.InterfaceVpcEndpointAwsService.STS,
    privateDnsEnabled: true,
  });
  stsEndpoint.node.addDependency(enableDnsHostnames);

  // Private bucket that holds the pinned Prince AWS Lambda zip (once per account).
  const project = process.env.PROJECT!;
  const account = stack.account;
  const meta = loadPrinceAssetMeta();
  const bucketName = princeAssetBucketName(project, account);

  const princeAssetsBucket = new s3.Bucket(stack, "PrinceAssetsBucket", {
    bucketName,
    encryption: s3.BucketEncryption.S3_MANAGED,
    blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
    enforceSSL: true,
    versioned: true,
    // Account-level asset store — keep across stack updates; destroy only if empty.
    removalPolicy: RemovalPolicy.RETAIN,
    autoDeleteObjects: false,
  });

  new CfnOutput(stack, "PrinceAssetsBucketName", {
    value: princeAssetsBucket.bucketName,
    description: `Upload prince-${meta.version}-aws-lambda.zip via ./scripts/publish-prince-asset.sh`,
  });
}
