#!/usr/bin/env node
import "source-map-support/register";
import {
  App,
  aws_apigateway as apigateway,
  aws_iam as iam,
  DefaultStackSynthesizer,
  Stack,
  StackProps,
  Tags,
} from "aws-cdk-lib";
import { CloudWatchLogsResourcePolicy } from "./constructs/cloudwatch-logs-resource-policy";
import { loadDefaultSecret } from "./deployment-config";
import { Construct } from "constructs";

interface PrerequisiteConfigProps {
  project: string;
  branchFilter: string;
}

export class PrerequisiteStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    props: StackProps & PrerequisiteConfigProps
  ) {
    super(scope, id, props);

    const { project, branchFilter } = props;

    new CloudWatchLogsResourcePolicy(this, "logPolicy", { project });

    const cloudWatchRole = new iam.Role(
      this,
      "ApiGatewayRestApiCloudWatchRole",
      {
        assumedBy: new iam.ServicePrincipal("apigateway.amazonaws.com"),
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName(
            "service-role/AmazonAPIGatewayPushToCloudWatchLogs" // pragma: allowlist secret
          ),
        ],
      }
    );

    new apigateway.CfnAccount(this, "ApiGatewayRestApiAccount", {
      cloudWatchRoleArn: cloudWatchRole.roleArn,
    });

    const githubProvider = new iam.OidcProviderNative(
      this,
      "GitHubIdentityProvider",
      {
        url: "https://token.actions.githubusercontent.com",
        thumbprints: ["6938fd4d98bab03faadb97b34396831e3780aea1"], // pragma: allowlist secret
        clientIds: ["sts.amazonaws.com"],
      }
    );

    new iam.Role(this, "GitHubActionsServiceRole", {
      description: "Service Role for use in GitHub Actions",
      assumedBy: new iam.FederatedPrincipal(
        githubProvider.oidcProviderArn,
        {
          StringEquals: {
            "token.actions.githubusercontent.com:aud": "sts.amazonaws.com",
          },
          StringLike: {
            "token.actions.githubusercontent.com:sub": `repo:Enterprise-CMCS/macpro-mdct-carts:${branchFilter}`,
          },
        },
        "sts:AssumeRoleWithWebIdentity"
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromManagedPolicyName(
          this,
          "ADORestrictionPolicy",
          "ADO-Restriction-Policy"
        ),
        iam.ManagedPolicy.fromManagedPolicyName(
          this,
          "CMSApprovedServicesPolicy",
          "CMSApprovedAWSServices"
        ),
        iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess"),
      ],
    });
  }
}

async function main() {
  const app = new App({
    defaultStackSynthesizer: new DefaultStackSynthesizer({
      deployRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-deploy-role-${AWS::AccountId}-${AWS::Region}",
      fileAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-file-publishing-role-${AWS::AccountId}-${AWS::Region}",
      imageAssetPublishingRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-image-publishing-role-${AWS::AccountId}-${AWS::Region}",
      cloudFormationExecutionRole:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-cfn-exec-role-${AWS::AccountId}-${AWS::Region}",
      lookupRoleArn:
        "arn:${AWS::Partition}:iam::${AWS::AccountId}:role/delegatedadmin/developer/cdk-${Qualifier}-lookup-role-${AWS::AccountId}-${AWS::Region}",
      qualifier: "hnb659fds",
    }),
  });

  Tags.of(app).add("PROJECT", "CARTS");

  const project = process.env.PROJECT!;
  new PrerequisiteStack(app, "carts-prerequisites", {
    project,
    ...(await loadDefaultSecret(project)),
    env: {
      account: process.env.CDK_DEFAULT_ACCOUNT,
      region: "us-east-1",
    },
  });
}

main();
