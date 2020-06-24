locals {
  endpoint_api_postgres = var.acm_certificate_domain_api_postgres == "" ? "http://${aws_alb.api_postgres.dns_name}:8000" : "https://${aws_alb.api_postgres.dns_name}"
}

resource "aws_ecs_task_definition" "api_postgres" {
  family                   = "api-postgres-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_api.json.tpl", {
    image             = "${var.ecr_repository_url_api_postgres}:${var.application_version}"
    postgres_host     = module.db.this_db_instance_address
    postgres_db       = module.db.this_db_instance_name
    postgres_user     = module.db.this_db_instance_username
    postgres_password = var.postgres_password
  })
}

resource "aws_security_group" "api_postgres" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "api_postgress_ingress" {
  type                     = "ingress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_api.id
  security_group_id        = aws_security_group.api.id
}

resource "aws_security_group_rule" "api_postgress_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.db.id
  security_group_id        = aws_security_group.api_postgress.id
}

resource "aws_security_group_rule" "api_postgress_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_postgress.id
}

resource "aws_ecs_service" "api_postgress" {
  name            = "api_postgress"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.api_postgress.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 6
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.api_postgress.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.api_postgress.arn
    container_name   = "api_postgress"
    container_port   = 8000
  }
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent
}

resource "null_resource" "wait_for_ecs_stability_api_postgres" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.api_postgress.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.application.name} --services ${aws_ecs_service.api_postgress.name}"
  }
  depends_on = [aws_ecs_service.api_postgress]
}

resource "aws_security_group" "alb_api_postgress" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_api_postgress_egress" {
  type                     = "egress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_postgress.id
  security_group_id        = aws_security_group.alb_api_postgress.id
}

resource "aws_security_group_rule" "alb_api_postgress_ingress_8000" {
  type              = "ingress"
  from_port         = 8000
  to_port           = 8000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgress.id
}

resource "aws_security_group_rule" "alb_api_postgress_ingress_443" {
  count             = var.acm_certificate_domain_api_postgress == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgress.id
}

resource "aws_alb" "api_postgress" {
  name            = "api_postgress-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api_postgress.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api_postgress" {
  name                 = "api_postgress-target-group-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.api_postgress]
}

data "aws_acm_certificate" "api_postgress" {
  count    = var.acm_certificate_domain_api_postgress == "" ? 0 : 1
  domain   = var.acm_certificate_domain_api_postgress
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_api_postgress" {
  count             = var.acm_certificate_domain_api_postgress == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgress.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.api_postgress[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.api_postgress.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_api_postgress" {
  count             = var.acm_certificate_domain_api_postgress == "" ? 1 : 0
  load_balancer_arn = aws_alb.api_postgress.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgress.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_api_postgress" {
  count             = var.acm_certificate_domain_api_postgress == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgress.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgress.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}
