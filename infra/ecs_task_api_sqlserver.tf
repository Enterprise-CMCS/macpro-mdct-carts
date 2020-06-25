locals {
  endpoint_api_sqlserver = var.acm_certificate_domain_api_sqlserver == "" ? "http://${aws_alb.api_sqlserver.dns_name}:8000" : "https://${aws_alb.api_sqlserver.dns_name}"
}

resource "aws_ecs_task_definition" "api_sqlserver" {
  family                   = "api_sqlserver-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_api_sqlserver.json.tpl", {
    image = "${var.ecr_repository_url_api_sqlserver}:${var.application_version}"
  })
}

resource "aws_security_group" "api_sqlserver" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "api_sqlserver_ingress" {
  type                     = "ingress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_api_sqlserver.id
  security_group_id        = aws_security_group.api_sqlserver.id
}

resource "aws_security_group_rule" "api_sqlserver_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.db.id
  security_group_id        = aws_security_group.api_sqlserver.id
}

resource "aws_security_group_rule" "api_sqlserver_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_sqlserver.id
}

resource "aws_ecs_service" "api_sqlserver" {
  name            = "api_sqlserver"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.api_sqlserver.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 6
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.api_sqlserver.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.api_sqlserver.arn
    container_name   = "api_sqlserver"
    container_port   = 8000
  }
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent
}

resource "null_resource" "wait_for_ecs_stability_api_sqlserver" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.api_sqlserver.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.application.name} --services ${aws_ecs_service.api_sqlserver.name}"
  }
  depends_on = [aws_ecs_service.api_sqlserver]
}

resource "aws_security_group" "alb_api_sqlserver" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_api_sqlserver_egress" {
  type                     = "egress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_sqlserver.id
  security_group_id        = aws_security_group.alb_api_sqlserver.id
}

resource "aws_security_group_rule" "alb_api_sqlserver_ingress_8000" {
  type              = "ingress"
  from_port         = 8000
  to_port           = 8000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_sqlserver.id
}

resource "aws_security_group_rule" "alb_api_sqlserver_ingress_443" {
  count             = var.acm_certificate_domain_api_sqlserver == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_sqlserver.id
}

resource "aws_alb" "api_sqlserver" {
  name            = "api-sqlserver-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api_sqlserver.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api_sqlserver" {
  name                 = "api-sqlserver-tg-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.api_sqlserver]
}

data "aws_acm_certificate" "api_sqlserver" {
  count    = var.acm_certificate_domain_api_sqlserver == "" ? 0 : 1
  domain   = var.acm_certificate_domain_api_sqlserver
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_api_sqlserver" {
  count             = var.acm_certificate_domain_api_sqlserver == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_sqlserver.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.api_sqlserver[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.api_sqlserver.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_api_sqlserver" {
  count             = var.acm_certificate_domain_api_sqlserver == "" ? 1 : 0
  load_balancer_arn = aws_alb.api_sqlserver.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_sqlserver.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_api_sqlserver" {
  count             = var.acm_certificate_domain_api_sqlserver == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_sqlserver.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_sqlserver.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}
