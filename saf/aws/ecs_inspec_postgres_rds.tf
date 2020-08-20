
data "aws_ssm_parameter" "postgres_user" {
  name = "/${terraform.workspace}/postgres_user"
}

data "aws_ssm_parameter" "postgres_password" {
  name = "/${terraform.workspace}/postgres_password"
}

data "aws_ssm_parameter" "postgres_host" {
  name = "/${terraform.workspace}/postgres_host"
}

data "aws_ssm_parameter" "postgres_db" {
  name = "/${terraform.workspace}/postgres_db"
}

data "aws_ssm_parameter" "postgres_security_group" {
  name = "/${terraform.workspace}/postgres_security_group"
}


####################################################################################################
# Create an inspec_postgres_rds ECS Task Def to scan RDS
####################################################################################################
data "aws_ecr_repository" "inspec_postgres_rds" {
  name = "inspec_postgres_rds"
}

resource "aws_ecs_task_definition" "inspec_postgres_rds" {
  family                   = "inspec_postgres_rds-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 4096
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_inspec_postgres_rds.json.tpl", {
    image                    = "${data.aws_ecr_repository.inspec_postgres_rds.repository_url}:${var.application_version}",
    postgres_host            = data.aws_ssm_parameter.postgres_host.value,
    postgres_user            = data.aws_ssm_parameter.postgres_user.value,
    postgres_password        = data.aws_ssm_parameter.postgres_password.value,
    postgres_db              = data.aws_ssm_parameter.postgres_db.value,
    cloudwatch_log_group     = aws_cloudwatch_log_group.saf.name,
    cloudwatch_stream_prefix = "inspec_postgres_rds"
  })
}

resource "aws_security_group" "inspec_postgres_rds" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "inspec_postgres_rds_egress" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.inspec_postgres_rds.id
}

resource "aws_security_group_rule" "db_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.inspec_postgres_rds.id
  security_group_id        = data.aws_ssm_parameter.postgres_security_group.value
}

####################################################################################################
