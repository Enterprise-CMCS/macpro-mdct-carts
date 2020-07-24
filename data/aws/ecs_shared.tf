
####################################################################################################
# Create some base IAM objects for ECS tasks and services, often shared
####################################################################################################
resource "aws_iam_role" "ecs_task" {
  name               = "ecs-task-role-${terraform.workspace}"
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_role" "ecs_execution_role" {
  name               = "ecs-execution-role-${terraform.workspace}"
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_policy" "execution_policy" {
  name   = "ecs_execution_policy_${terraform.workspace}"
  policy = file("files/ecs_execution_policy.json")
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.ecs_execution_role.id
  policy_arn = aws_iam_policy.execution_policy.arn
}
####################################################################################################

####################################################################################################
# Create an ECS Cluster for the data layer, pretty much just containing the deployer container for now
####################################################################################################
resource "aws_ecs_cluster" "database" {
  name               = "datbase-${terraform.workspace}"
  capacity_providers = ["FARGATE"]
}

resource "aws_cloudwatch_log_group" "database" {
  name = "database-${terraform.workspace}"
  tags = {
    Workspace = terraform.workspace
  }
}
####################################################################################################
