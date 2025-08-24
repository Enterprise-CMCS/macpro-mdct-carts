import { Construct } from "constructs";
import {
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_lambda_nodejs as lambda_nodejs,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { createHash } from "crypto";

interface LambdaKafkaEventProps
  extends Partial<lambda_nodejs.NodejsFunctionProps> {
  additionalPolicies?: iam.PolicyStatement[];
  kafkaBootstrapServers: string[];
  securityGroupId: string;
  subnets: string[];
  topics: string[];
  consumerGroupId: string;
  stackName: string;
  isDev: boolean;
}

export class LambdaKafkaEventSource extends Construct {
  public readonly lambda: lambda_nodejs.NodejsFunction;

  constructor(scope: Construct, id: string, props: LambdaKafkaEventProps) {
    super(scope, id);

    const {
      additionalPolicies = [],
      handler,
      memorySize = 1024,
      timeout = Duration.seconds(6),
      kafkaBootstrapServers,
      securityGroupId,
      subnets,
      topics,
      consumerGroupId,
      stackName,
      isDev,
      ...restProps
    } = props;

    const role = new iam.Role(this, `${id}LambdaExecutionRole`, {
      assumedBy: new iam.ServicePrincipal("lambda.amazonaws.com"),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          "service-role/AWSLambdaVPCAccessExecutionRole"
        ),
      ],
      inlinePolicies: {
        LambdaPolicy: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: [
                "logs:CreateLogGroup",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
              ],
              resources: ["arn:aws:logs:*:*:*"],
            }),
            new iam.PolicyStatement({
              effect: iam.Effect.ALLOW,
              actions: ["ec2:DescribeSecurityGroups", "ec2:DescribeVpcs"],
              resources: ["*"],
            }),
            ...additionalPolicies,
          ],
        }),
      },
    });

    const logGroup = new logs.LogGroup(this, `${id}LogGroup`, {
      logGroupName: `/aws/lambda/${stackName}-${id}`,
      removalPolicy: isDev ? RemovalPolicy.DESTROY : RemovalPolicy.RETAIN,
      retention: logs.RetentionDays.THREE_YEARS, // exceeds the 30 month requirement
    });

    this.lambda = new lambda_nodejs.NodejsFunction(this, id, {
      functionName: `${stackName}-${id}`,
      handler,
      runtime: lambda.Runtime.NODEJS_20_X,
      timeout,
      memorySize,
      role,
      bundling: {
        assetHash: createHash("sha256")
          .update(`${Date.now()}-${id}`)
          .digest("hex"),
        minify: true,
        sourceMap: true,
        nodeModules: ["kafkajs"],
      },
      logGroup,
      ...restProps,
    });

    new lambda.CfnEventSourceMapping(scope, `${id}KafkaEventSourceMapping`, {
      functionName: this.lambda.functionArn,
      selfManagedEventSource: {
        endpoints: { kafkaBootstrapServers },
      },
      selfManagedKafkaEventSourceConfig: { consumerGroupId },
      topics,
      sourceAccessConfigurations: [
        ...subnets.map((subnetId) => ({
          type: "VPC_SUBNET",
          uri: `subnet:${subnetId}`,
        })),
        {
          type: "VPC_SECURITY_GROUP",
          uri: `security_group:${securityGroupId}`,
        },
      ],
      maximumBatchingWindowInSeconds: 30,
    });
  }
}
