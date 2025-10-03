import { aws_ec2 as ec2, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import { LambdaDynamoEventSource } from "../constructs/lambda-dynamo-event";
import { getSubnets } from "../utils/vpc";
import { LambdaKafkaEventSource } from "../constructs/lambda-kafka-event";
import { DynamoDBTableIdentifiers } from "../constructs/dynamodb-table";

interface CreateBigmacStreamsComponentsProps {
  scope: Construct;
  stage: string;
  project: string;
  isDev: boolean;
  vpcName: string;
  kafkaAuthorizedSubnetIds: string;
  brokerString: string;
  stageEnrollmentCountsTableName: string;
  tables: DynamoDBTableIdentifiers[];
  sedsTopic: string;
}

export function createBigmacStreamsComponents(
  props: CreateBigmacStreamsComponentsProps
) {
  const {
    scope,
    stage,
    project,
    vpcName,
    kafkaAuthorizedSubnetIds,
    brokerString,
    tables,
    sedsTopic,
    isDev,
  } = props;

  const kafkaBootstrapServers = brokerString.split(",");

  const service = "carts-bigmac-streams";

  const vpc = ec2.Vpc.fromLookup(scope, "Vpc", { vpcName });
  const kafkaAuthorizedSubnets = getSubnets(
    scope,
    kafkaAuthorizedSubnetIds ?? ""
  );

  const lambdaSG = new ec2.SecurityGroup(
    scope,
    "LambdaConfigureConnectorsSecurityGroup",
    {
      vpc,
      description: "Security Group for configuring the connector.",
      allowAllOutbound: true,
    }
  );

  new ec2.CfnSecurityGroupIngress(scope, "LambdaSecurityGroupIngressCluster", {
    groupId: lambdaSG.securityGroupId,
    ipProtocol: "tcp",
    fromPort: 8083,
    toPort: 8083,
    sourceSecurityGroupId: lambdaSG.securityGroupId,
  });

  const commonProps = {
    project,
    stage,
    brokerString,
    stackName: `${service}-${stage}`,
    isDev,
  };

  /*
   * TODO: these permissions are needed for one or both of these functions:
   *   - Effect: Allow
   *   Action:
   *     - dynamodb:DescribeTable
   *     - dynamodb:UpdateItem
   *   Resource: "*"
   * - Effect: Allow
   *   Action:
   *     - dynamodb:DescribeStream
   *     - dynamodb:GetRecords
   *     - dynamodb:GetShardIterator
   *     - dynamodb:ListShards
   *     - dynamodb:ListStreams
   *   Resource:
   *     - >-
   *       arn:aws:dynamodb:us-east-1:519095364708:table/main-state-status/stream/2022-05-20T16:01:34.237
   *     - >-
   *       arn:aws:dynamodb:us-east-1:519095364708:table/main-section/stream/2022-05-20T16:01:33.665
   * - Effect: Allow
   *   Action:
   *     - dynamodb:GetRecords
   *     - dynamodb:GetShardIterator
   *     - dynamodb:DescribeStream
   *     - dynamodb:ListStreams
   *   Resource:
   *     - >-
   *       arn:aws:dynamodb:us-east-1:519095364708:table/main-state-status/stream/2022-05-20T16:01:34.237
   *     - >-
   *       arn:aws:dynamodb:us-east-1:519095364708:table/main-section/stream/2022-05-20T16:01:33.665
   */

  new LambdaKafkaEventSource(scope, "sinkEnrollmentCounts", {
    entry: "services/carts-bigmac-streams/handlers/sinkEnrollmentCounts.js",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 1024,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [lambdaSG],
    kafkaBootstrapServers,
    securityGroupId: lambdaSG.securityGroupId,
    subnets: kafkaAuthorizedSubnetIds.split(","),
    topics: [sedsTopic],
    consumerGroupId: `${project}-${stage}`,
    ...commonProps,
  });

  // postKafkaData Lambda with two DynamoDB streams
  new LambdaDynamoEventSource(scope, "postKafkaData", {
    entry: "services/carts-bigmac-streams/handlers/kafka/post/postKafkaData.js",
    handler: "handler",
    timeout: Duration.seconds(120),
    memorySize: 2048,
    retryAttempts: 2,
    vpc,
    vpcSubnets: { subnets: kafkaAuthorizedSubnets },
    securityGroups: [lambdaSG],
    environment: {
      brokerString,
      STAGE: stage,
    },
    ...commonProps,
    tables,
  });
}
