import { Construct } from "constructs";
import { aws_s3 as s3, Aws, CfnOutput, Stack, StackProps } from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../deployment-config";
import { createDataComponents } from "./data";
import { createUiAuthComponents } from "./ui-auth";
import { createUiComponents } from "./ui";
import { createApiComponents } from "./api";
import { deployFrontend } from "./deployFrontend";
import { createCustomResourceRole } from "./customResourceRole";
import { isLocalStack } from "../local/util";
import { createUploadsComponents } from "./uploads";
import { createBigmacStreamsComponents } from "./bigmac-streams";

export class ParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    const { isDev, secureCloudfrontDomainName, stage } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const commonProps = {
      scope: this,
      ...props,
    };

    const attachmentsBucketName = isLocalStack
      ? process.env.S3_ATTACHMENTS_BUCKET_NAME
      : `uploads-${stage}-attachments-${Aws.ACCOUNT_ID}`;
    const fiscalYearTemplateBucketName = `uploads-${stage}-carts-download-${Aws.ACCOUNT_ID}`;

    const customResourceRole = createCustomResourceRole({ ...commonProps });

    const loggingBucket = s3.Bucket.fromBucketName(
      this,
      "LoggingBucket",
      `cms-cloud-${Aws.ACCOUNT_ID}-${Aws.REGION}`
    );

    const { tables } = createDataComponents({
      ...commonProps,
      customResourceRole,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      attachmentsBucketName: attachmentsBucketName!,
      fiscalYearTemplateBucketName,
    });

    const attachmentsBucketArn = createUploadsComponents({
      ...commonProps,
      loggingBucket,
      attachmentsBucketName: attachmentsBucketName!,
      fiscalYearTemplateBucketName,
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
        customResourceRole,
        restApiId,
        attachmentsBucketArn,
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
      customResourceRole,
      attachmentsBucketName: attachmentsBucketName!,
    });

    if (!isDev) {
      createBigmacStreamsComponents({
        ...commonProps,
        stageEnrollmentCountsTableName: "main-stg-enrollment-counts",
        tables: tables.filter((table) =>
          ["StateStatus", "Section"].includes(table.id)
        ),
      });
    }

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });
  }
}
