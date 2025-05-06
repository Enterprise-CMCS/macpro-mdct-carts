import { Construct } from "constructs";
import {
  Aws,
  aws_iam as iam,
  aws_s3 as s3,
  CfnOutput,
  Stack,
  StackProps,
} from "aws-cdk-lib";
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
    const { isDev, secureCloudfrontDomainName, brokerString } = props;

    super(scope, id, {
      ...props,
      terminationProtection: !isDev,
    });

    const commonProps = {
      scope: this,
      ...props,
    };

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

    if (isLocalStack) {
      createApiComponents({
        ...commonProps,
        tables,
        uploadS3BucketName: "",
        fiscalYearTemplateS3BucketName: "",
      });
      /*
       * For local dev, the LocalStack container will host the database and API.
       * The UI will self-host, so we don't need to tell CDK anything about it.
       * Also, we skip authorization locally. So we don't set up Cognito,
       * or configure the API to interact with it. Therefore, we're done.
       */
      return;
    }

    const { attachmentsBucket, fiscalYearTemplateBucket } =
      createUploadsComponents({
        ...commonProps,
        loggingBucket,
      });

    const { applicationEndpointUrl, distribution, uiBucket } =
      createUiComponents({
        ...commonProps,
        loggingBucket,
      });

    const {
      userPoolDomainName,
      identityPoolId,
      userPoolId,
      userPoolClientId,
      createAuthRole,
    } = createUiAuthComponents({
      ...commonProps,
      applicationEndpointUrl,
      customResourceRole,
      attachmentsBucketArn: attachmentsBucket!.bucketArn,
    });

    const { apiGatewayRestApiUrl, restApiId } = createApiComponents({
      ...commonProps,
      tables,
      uploadS3BucketName: attachmentsBucket.bucketName,
      fiscalYearTemplateS3BucketName: fiscalYearTemplateBucket
        ? fiscalYearTemplateBucket.bucketName
        : "",
    });

    createAuthRole(restApiId);

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
      s3AttachmentsBucketName: attachmentsBucket!.bucketName,
    });

    createBigmacStreamsComponents({
      ...commonProps,
      kafkaBootstrapServers: brokerString.split(","),
      stageEnrollmentCountsTableName: "main-stg-enrollment-counts",
      tables: tables.filter((table) =>
        ["StateStatus", "Section"].includes(table.id)
      ),
    });

    new CfnOutput(this, "CloudFrontUrl", {
      value: applicationEndpointUrl,
    });
  }
}
