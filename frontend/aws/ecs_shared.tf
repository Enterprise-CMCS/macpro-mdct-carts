
####################################################################################################
# Create some base IAM objects for ECS tasks and services, often shared
####################################################################################################
resource "aws_iam_role" "ecs_task" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_policy" "uploads_bucket" {
  policy = templatefile("templates/api_policy_for_uploads_bucket.json.tpl", {
    uploads_bucket_arn = aws_s3_bucket.uploads.arn
  })
}

resource "aws_iam_role_policy_attachment" "uploads_bucket" {
  role       = aws_iam_role.ecs_task.id
  policy_arn = aws_iam_policy.uploads_bucket.arn
}

resource "aws_iam_role" "ecs_execution_role" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_policy" "execution_policy" {
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
  name = "/aws/fargate/${terraform.workspace}"
  tags = {
    Workspace = terraform.workspace
  }
}
####################################################################################################
