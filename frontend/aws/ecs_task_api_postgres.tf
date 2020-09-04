locals {
  endpoint_api_postgres = var.acm_certificate_domain_api_postgres == "" ? "http://${aws_alb.api_postgres.dns_name}" : "https://${aws_alb.api_postgres.dns_name}"
}

# Number of container instances to spawn per resource. Default is 1. 
locals {
  dev_postgres     = substr(terraform.workspace, 0, 4) == "dev-" ? 1 : 0
  master_postgres  = terraform.workspace == "master" ? 1 : 0
  staging_postgres = terraform.workspace == "staging" ? 1 : 0
  prod_postgres    = terraform.workspace == "prod" ? 3 : 0

  count_postgres         = local.dev_postgres + local.master_postgres + local.staging_postgres + local.prod_postgres
  desired_count_postgres = local.count_postgres > 0 ? local.count_postgres : 1
}

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

data "aws_ecr_repository" "postgres_django" {
  name = "postgres_django"
}

resource "aws_ecs_task_definition" "api_postgres" {
  family                   = "api_postgres-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_api_postgres.json.tpl", {
    image                    = "${data.aws_ecr_repository.postgres_django.repository_url}:${var.application_version}",
    postgres_host            = data.aws_ssm_parameter.postgres_host.value,
    postgres_db              = data.aws_ssm_parameter.postgres_db.value,
    postgres_user            = data.aws_ssm_parameter.postgres_user.value,
    postgres_password        = data.aws_ssm_parameter.postgres_password.value,
    cloudwatch_log_group     = aws_cloudwatch_log_group.frontend.name,
    cloudwatch_stream_prefix = "api_postgres"
  })
}

resource "aws_security_group" "api_postgres" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "api_postgres_ingress" {
  type                     = "ingress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_api_postgres.id
  security_group_id        = aws_security_group.api_postgres.id
}

resource "aws_security_group_rule" "api_postgres_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = data.aws_ssm_parameter.postgres_security_group.value
  security_group_id        = aws_security_group.api_postgres.id
}

resource "aws_security_group_rule" "postgres_ingress_from_api_postgres" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_postgres.id
  security_group_id        = data.aws_ssm_parameter.postgres_security_group.value
}

resource "aws_security_group_rule" "api_postgres_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_postgres.id
}

resource "aws_ecs_service" "api_postgres" {
  name            = "api_postgres"
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.api_postgres.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = local.desired_count_postgres
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.api_postgres.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.api_postgres.arn
    container_name   = "api_postgres"
    container_port   = 8000
  }
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent
}

resource "null_resource" "wait_for_ecs_stability_api_postgres" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.api_postgres.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.frontend.name} --services ${aws_ecs_service.api_postgres.name}"
  }
  depends_on = [aws_ecs_service.api_postgres]
}


resource "aws_security_group" "alb_api_postgres" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_api_postgres_egress" {
  type                     = "egress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_postgres.id
  security_group_id        = aws_security_group.alb_api_postgres.id
}

resource "aws_security_group_rule" "alb_api_postgres_ingress_8000" {
  type              = "ingress"
  from_port         = 8000
  to_port           = 8000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgres.id
}

resource "aws_security_group_rule" "alb_api_postgres_ingress_443" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgres.id
}

resource "aws_alb" "api_postgres" {
  name            = "api-postgres-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api_postgres.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api_postgres" {
  name                 = "api-postgres-tg-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "1"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.api_postgres]
}

data "aws_acm_certificate" "api_postgres" {
  count    = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  domain   = var.acm_certificate_domain_api_postgres
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.api_postgres[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 1 : 0
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}
