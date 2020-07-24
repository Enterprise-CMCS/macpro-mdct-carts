locals {
  deployment_minimum_healthy_percent = terraform.workspace == "prod" ? 100 : 0
}

####################################################################################################
# Create some base IAM objects for ECS tasks and services, often shared
####################################################################################################
resource "aws_iam_role" "ecs_task" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_role" "ecs_execution_role" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_policy" "execution_policy" {
  name   = "ecs_execution_policy_frontend_${terraform.workspace}"
  policy = file("files/ecs_execution_policy.json")
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.ecs_execution_role.id
  policy_arn = aws_iam_policy.execution_policy.arn
}
####################################################################################################


####################################################################################################
# Create an ECS Cluster for the frontend
####################################################################################################
resource "aws_ecs_cluster" "frontend" {
  name               = "frontend-${terraform.workspace}"
  capacity_providers = ["FARGATE"]
}

resource "aws_service_discovery_private_dns_namespace" "frontend" {
  name        = "frontend-${terraform.workspace}.local"
  description = "frontend-private-dns-${terraform.workspace}"
  vpc         = data.aws_vpc.app.id
}

resource "aws_cloudwatch_log_group" "frontend" {
  name = "frontend-${terraform.workspace}"
  tags = {
    Workspace = terraform.workspace
  }
}
####################################################################################################
