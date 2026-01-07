import { Construct } from "constructs";
import type { StackProps } from "aws-cdk-lib";
import {
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_s3 as s3,
  Aws,
  CfnOutput,
  Stack,
} from "aws-cdk-lib";
import type { DeploymentConfigProperties } from "../deployment-config.ts";
import { createDataComponents } from "./data.ts";
import { createUiAuthComponents } from "./ui-auth.ts";
import { createUiComponents } from "./ui.ts";
import { createApiComponents } from "./api.ts";
import { deployFrontend } from "./deployFrontend.ts";
import { isLocalStack } from "../local/util.ts";
import { createTopicsComponents } from "./topics.ts";
import { createBigmacStreamsComponents } from "./bigmac-streams.ts";
import { createUploadsComponents } from "./uploads.ts";
import { getSubnets } from "../utils/vpc.ts";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const {
      isDev,
      secureCloudfrontDomainName,
      stage,
      vpcName,
      kafkaAuthorizedSubnetIds,
    } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const commonProps = {
      scope: this,
      ...props,
      isDev,
    };

    const vpc = ec2.Vpc.fromLookup(this, "Vpc", { vpcName });
    const kafkaAuthorizedSubnets = getSubnets(this, kafkaAuthorizedSubnetIds);

    const attachmentsBucketName = `uploads-${stage}-attachments-${Aws.ACCOUNT_ID}`;

    const loggingBucket = s3.Bucket.fromBucketName(
      this,
      "LoggingBucket",
      `cms-cloud-${Aws.ACCOUNT_ID}-${Aws.REGION}`
    );

    const { tables } = createDataComponents({
      ...commonProps,
    });

    const attachmentsBucket = createUploadsComponents({
      ...commonProps,
      loggingBucket,
      attachmentsBucketName: attachmentsBucketName!,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      attachmentsBucket,
    });

    if (isLocalStack) {
      /*
       * For local dev, the LocalStack container will host the database and API.
       * The UI will self-host, so we don't need to tell CDK anything about it.
       * Also, we skip authorization locally. So we don't set up Cognito,
       * or configure the API to interact with it. Therefore, we're done.
       */
      return;
    }

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents({
        ...commonProps,
        loggingBucket,
      });

    const { userPoolDomainName, identityPoolId, userPoolId, userPoolClientId } =
      createUiAuthComponents({
        ...commonProps,
        applicationEndpointUrl,
        restApiId,
      });

    deployFrontend({
      ...commonProps,
      uiBucket,
      distribution,
      apiGatewayRestApiUrl,
      applicationEndpointUrl:
        secureCloudfrontDomainName ?? applicationEndpointUrl,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      userPoolClientDomain: `${userPoolDomainName}.auth.${Aws.REGION}.amazoncognito.com`,
      attachmentsBucketName: attachmentsBucketName!,
    });

    if (!isDev) {
      createBigmacStreamsComponents({
        ...commonProps,
        vpc,
        kafkaAuthorizedSubnets,
        stageEnrollmentCountsTable: tables.find(
          (table) => table.node.id === "StageEnrollmentCounts"
        )!,
        tables: tables.filter((table) =>
          ["StateStatus", "Section"].includes(table.node.id)
        ),
      });
    }

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });

    createTopicsComponents({
      ...commonProps,
      vpc,
      kafkaAuthorizedSubnets,
    });

    if (isDev) {
      applyDenyCreateLogGroupPolicy(this);
    }
  }
}

function applyDenyCreateLogGroupPolicy(stack: Stack) {
  const denyCreateLogGroupPolicy = {
    PolicyName: "DenyCreateLogGroup",
    PolicyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Deny",
          Action: "logs:CreateLogGroup",
          Resource: "*",
        },
      ],
    },
  };

  const findRole = (id: string) =>
    stack.node.tryFindChild(id)?.node.tryFindChild("Role") as iam.CfnRole;

  findRole(
    "Custom::S3AutoDeleteObjectsCustomResourceProvider"
  )?.addPropertyOverride("Policies", [denyCreateLogGroupPolicy]);

  findRole(
    "AWSCDK.TriggerCustomResourceProviderCustomResourceProvider"
  )?.addPropertyOverride("Policies.1", denyCreateLogGroupPolicy);

  stack.node
    .findAll()
    .filter((c) => c.node.id.startsWith("BucketNotificationsHandler"))
    .forEach((c) => {
      (
        c.node
          .tryFindChild("Role")
          ?.node.tryFindChild("Resource") as iam.CfnRole
      )?.addPropertyOverride("Policies", [denyCreateLogGroupPolicy]);
    });
}
