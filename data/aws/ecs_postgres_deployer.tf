# Number of container instances to spawn per resource. Default is 1. 
locals {
  dev_pgdeployer     = substr(terraform.workspace, 0, 4) == "dev-" ? 1 : 0
  master_pgdeployer  = terraform.workspace == "master" ? 1 : 0
  staging_pgdeployer = terraform.workspace == "staging" ? 1 : 0
  prod_pgdeployer    = terraform.workspace == "prod" ? 1 : 0

  count_pgdeployer         = local.dev_pgdeployer + local.master_pgdeployer + local.staging_pgdeployer + local.prod_pgdeployer
  desired_count_pgdeployer = local.count_pgdeployer > 0 ? local.count_pgdeployer : 1
}

####################################################################################################
# Create a postgres_deployer ECS Task Def to bootstrap postgres RDS with users, tables, etc
####################################################################################################
data "aws_ecr_repository" "postgres_deployer" {
  name = "postgres_deployer"
}

resource "aws_ecs_task_definition" "postgres_deployer" {
  family                   = "postgres_deployer-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_postgres_deployer.json.tpl", {
    image                    = "${data.aws_ecr_repository.postgres_deployer.repository_url}:${var.application_version}",
    postgres_host            = module.db.this_db_instance_address,
    postgres_user            = var.postgres_user,
    postgres_password        = random_password.postgres.result,
    postgres_db              = var.postgres_db,
    cloudwatch_log_group     = aws_cloudwatch_log_group.database.name,
    cloudwatch_stream_prefix = "postgres_deployer"
  })
}

resource "aws_security_group" "postgres_deployer" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "postgres_deployer_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.postgres_deployer.id
}

resource "aws_security_group_rule" "db_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.postgres_deployer.id
  security_group_id        = aws_security_group.db.id
}

resource "aws_ecs_service" "postgres_deployer" {
  name            = "postgres_deployer"
  cluster         = aws_ecs_cluster.database.id
  task_definition = aws_ecs_task_definition.postgres_deployer.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count                      = local.desired_count_pgdeployer
  deployment_minimum_healthy_percent = 0
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.postgres_deployer.id]
  }
}

resource "null_resource" "wait_for_ecs_stability_postgres_deployer" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.postgres_deployer.id
    ecs_service     = aws_ecs_service.postgres_deployer.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.database.name} --services ${aws_ecs_service.postgres_deployer.name}"
  }
  depends_on = [aws_ecs_service.postgres_deployer]
}

####################################################################################################
