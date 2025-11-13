import { aws_ec2 as ec2, custom_resources as cr, Stack } from "aws-cdk-lib";

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
}
