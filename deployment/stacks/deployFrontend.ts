import { Construct } from "constructs";
import {
  aws_cloudfront as cloudfront,
  aws_iam as iam,
  aws_s3 as s3,
  aws_s3_deployment as s3_deployment,
  custom_resources as cr,
  Duration,
} from "aws-cdk-lib";
import path from "path";
import { execSync } from "node:child_process";

interface DeployFrontendProps {
  apiGatewayRestApiUrl: string;
  applicationEndpointUrl: string;
  customResourceRole: iam.Role;
  distribution: cloudfront.Distribution;
  identityPoolId: string;
  launchDarklyClient: string;
  redirectSignout: string;
  scope: Construct;
  stage: string;
  uiBucket: s3.Bucket;
  userPoolClientDomain: string;
  userPoolClientId: string;
  userPoolId: string;
  s3AttachmentsBucketName: string;
}

export function deployFrontend(props: DeployFrontendProps) {
  const {
    apiGatewayRestApiUrl,
    applicationEndpointUrl,
    s3AttachmentsBucketName,
    distribution,
    identityPoolId,
    launchDarklyClient,
    redirectSignout,
    scope,
    stage,
    uiBucket,
    userPoolClientDomain,
    userPoolClientId,
    userPoolId,
  } = props;

  const reactAppPath = "./services/ui-src/";
  const buildOutputPath = path.join(reactAppPath, "build");
  const fullPath = path.resolve(reactAppPath);

  execSync("CI=false SKIP_PREFLIGHT_CHECK=true yarn run build", {
    cwd: fullPath,
    stdio: "inherit",
    env: {
      ...process.env,
      API_REGION: "us-east-1",
      API_URL: apiGatewayRestApiUrl,
      BRANCH_NAME: stage,
      COGNITO_IDENTITY_POOL_ID: identityPoolId,
      COGNITO_REDIRECT_SIGNIN: applicationEndpointUrl,
      COGNITO_REDIRECT_SIGNOUT: applicationEndpointUrl + "postLogout",
      COGNITO_REGION: "us-east-1",
      COGNITO_USER_POOL_CLIENT_DOMAIN: userPoolClientDomain,
      COGNITO_USER_POOL_CLIENT_ID: userPoolClientId,
      COGNITO_USER_POOL_ID: userPoolId,
      LOCAL_LOGIN: "false",
      POST_SIGNOUT_REDIRECT: redirectSignout,
      REACT_APP_LD_SDK_CLIENT: launchDarklyClient,
      S3_ATTACHMENTS_BUCKET_NAME: s3AttachmentsBucketName,
      S3_ATTACHMENTS_BUCKET_REGION: "us-east-1",
    },
  });

  const deploymentRole = new iam.Role(scope, "BucketDeploymentRole", {
    assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
    inlinePolicies: {
      InlinePolicy: new iam.PolicyDocument({
        statements: [
          new iam.PolicyStatement({
            actions: [
              "s3:PutObject",
              "s3:PutObjectAcl",
              "s3:DeleteObject",
              "s3:DeleteObjectVersion",
              "s3:GetBucketLocation",
              "s3:GetObject",
              "s3:ListBucket",
              "s3:ListBucketVersions",
            ],
            resources: [uiBucket.bucketArn, `${uiBucket.bucketArn}/*`],
          }),
          new iam.PolicyStatement({
            actions: ["cloudfront:CreateInvalidation"],
            resources: ["*"],
          }),
        ],
      }),
    },
  });

  const deployWebsite = new s3_deployment.BucketDeployment(
    scope,
    "DeployWebsite",
    {
      sources: [s3_deployment.Source.asset(buildOutputPath)],
      destinationBucket: uiBucket,
      distribution,
      distributionPaths: ["/*"],
      prune: true,
      cacheControl: [
        s3_deployment.CacheControl.setPublic(),
        s3_deployment.CacheControl.maxAge(Duration.days(365)),
        s3_deployment.CacheControl.noCache(),
      ],
      role: deploymentRole,
    }
  );

  const deployTimeConfig = new s3_deployment.DeployTimeSubstitutedFile(
    scope,
    "DeployTimeConfig",
    {
      destinationBucket: uiBucket,
      destinationKey: "env-config.js",
      source: path.join("./deployment/stacks/", "env-config.template.js"),
      substitutions: {
        localLogin: "false",
        apiGatewayRestApiUrl,
        applicationEndpointUrl,
        s3AttachmentsBucketName,
        identityPoolId,
        launchDarklyClient,
        redirectSignout,
        timestamp: new Date().toISOString(),
        userPoolClientDomain,
        userPoolClientId,
        userPoolId,
        stage,
      },
    }
  );

  deployTimeConfig.node.addDependency(deployWebsite);

  const invalidateCloudfront = new cr.AwsCustomResource(
    scope,
    "InvalidateCloudfront",
    {
      onCreate: undefined,
      onDelete: undefined,
      onUpdate: {
        service: "CloudFront",
        action: "createInvalidation",
        parameters: {
          DistributionId: distribution.distributionId,
          InvalidationBatch: {
            Paths: {
              Quantity: 1,
              Items: ["/*"],
            },
            CallerReference: new Date().toISOString(),
          },
        },
        physicalResourceId: cr.PhysicalResourceId.of(
          `InvalidateCloudfront-${stage}`
        ),
      },
      role: deploymentRole,
    }
  );

  invalidateCloudfront.node.addDependency(deployTimeConfig);
}
