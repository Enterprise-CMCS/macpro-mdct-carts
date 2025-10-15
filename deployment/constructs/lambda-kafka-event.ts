import { Construct } from "constructs";
import {
  aws_ec2 as ec2,
  aws_iam as iam,
  aws_lambda as lambda,
  aws_logs as logs,
  aws_s3 as s3,
  aws_lambda_nodejs as lambda_nodejs,
  Duration,
  RemovalPolicy,
} from "aws-cdk-lib";
import { createHash } from "crypto";
import { DynamoDBTable } from "./dynamodb-table";

interface LambdaKafkaEventProps
  extends Partial<lambda_nodejs.NodejsFunctionProps> {
  additionalPolicies?: iam.PolicyStatement[];
  kafkaBootstrapServers: string[];
  securityGroupId: string;
  topics: string[];
  consumerGroupId: string;
  stackName: string;
  isDev: boolean;
  tables?: DynamoDBTable[];
  buckets?: s3.IBucket[];
  vpcSubnets: ec2.SubnetSelection;
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
      topics,
      consumerGroupId,
      stackName,
      isDev,
      tables = [],
      buckets = [],
      vpcSubnets,
      ...restProps
    } = props;

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

    for (const stmt of additionalPolicies) {
      this.lambda.addToRolePolicy(stmt);
    }

    new lambda.CfnEventSourceMapping(scope, `${id}KafkaEventSourceMapping`, {
      functionName: this.lambda.functionArn,
      selfManagedEventSource: {
        endpoints: { kafkaBootstrapServers },
      },
      selfManagedKafkaEventSourceConfig: { consumerGroupId },
      topics,
      sourceAccessConfigurations: [
        ...vpcSubnets.subnets!.map((subnet: ec2.ISubnet) => ({
          type: "VPC_SUBNET",
          uri: `subnet:${subnet.subnetId}`,
        })),
        {
          type: "VPC_SECURITY_GROUP",
          uri: `security_group:${securityGroupId}`,
        },
      ],
      maximumBatchingWindowInSeconds: 30,
    });

    for (const ddbTable of tables) {
      ddbTable.table.grantReadWriteData(this.lambda);
      if (ddbTable.table.tableStreamArn) {
        ddbTable.table.grantStreamRead(this.lambda);
      }
    }

    for (const bucket of buckets) {
      bucket.grantReadWrite(this.lambda);
    }
  }
}
