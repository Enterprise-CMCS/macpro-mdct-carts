locals {
  endpoint_api = var.acm_certificate_domain_api == "" ? "http://${aws_alb.api.dns_name}:8000" : "https://${aws_alb.api.dns_name}"
}

resource "aws_ecs_task_definition" "api" {
  family                   = "api-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_api.json.tpl", {
    image             = "${var.ecr_repository_url_api}:${var.application_version}"
    postgres_host     = module.db.this_db_instance_address
    postgres_db       = module.db.this_db_instance_name
    postgres_user     = module.db.this_db_instance_username
    postgres_password = var.postgres_password
  })
}

resource "aws_security_group" "api" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "api_ingress" {
  type                     = "ingress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_api.id
  security_group_id        = aws_security_group.api.id
}

resource "aws_security_group_rule" "api_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.db.id
  security_group_id        = aws_security_group.api.id
}

resource "aws_security_group_rule" "api_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api.id
}

resource "aws_ecs_service" "api" {
  name            = "api"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.api.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 6
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.api.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.api.arn
    container_name   = "api"
    container_port   = 8000
  }
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent
}

resource "null_resource" "wait_for_ecs_stability_api" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.api.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.application.name} --services ${aws_ecs_service.api.name}"
  }
  depends_on = [aws_ecs_service.api]
}

resource "aws_security_group" "alb_api" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_api_egress" {
  type                     = "egress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api.id
  security_group_id        = aws_security_group.alb_api.id
}

resource "aws_security_group_rule" "alb_api_ingress_80" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api.id
}

resource "aws_security_group_rule" "alb_api_ingress_443" {
  count             = var.acm_certificate_domain_api == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api.id
}

resource "aws_alb" "api" {
  name            = "api-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api" {
  name                 = "api-target-group-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.api]
}

data "aws_acm_certificate" "api" {
  count    = var.acm_certificate_domain_api == "" ? 0 : 1
  domain   = var.acm_certificate_domain_api
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_api" {
  count             = var.acm_certificate_domain_api == "" ? 0 : 1
  load_balancer_arn = aws_alb.api.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.api.arn
  default_action {
    target_group_arn = aws_alb_target_group.api.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_api" {
  count             = var.acm_certificate_domain_api == "" ? 1 : 0
  load_balancer_arn = aws_alb.api.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_api" {
  count             = var.acm_certificate_domain_api == "" ? 0 : 1
  load_balancer_arn = aws_alb.api.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}
