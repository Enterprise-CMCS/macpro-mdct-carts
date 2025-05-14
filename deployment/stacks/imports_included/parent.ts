import { Construct } from "constructs";
import { aws_s3 as s3, Aws, Stack, StackProps } from "aws-cdk-lib";
import { DeploymentConfigProperties } from "../../deployment-config";
import { createDataComponents } from "./data";
import { createUiComponents } from "./ui";
import { createUiAuthComponents } from "./ui-auth";
import { createUploadsComponents } from "./uploads";

export class ImportsIncludedParentStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & DeploymentConfigProperties
  ) {
    super(scope, id, props);

    const { stage } = props;

    const isDev = false; // imports are only being done on persistent environments.

    const loggingBucket = s3.Bucket.fromBucketName(
      this,
      "LoggingBucket",
      `cms-cloud-${Aws.ACCOUNT_ID}-${Aws.REGION}`
    );

    createDataComponents({
      scope: this,
      stage,
      isDev,
    });
    createUiComponents({ scope: this, stage });
    createUiAuthComponents({
      scope: this,
      stage,
    });
    createUploadsComponents({
      scope: this,
      stage,
      loggingBucket,
      isDev: false,
    });
  }
}
