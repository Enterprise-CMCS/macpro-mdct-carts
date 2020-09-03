locals {
  endpoint_ui = var.acm_certificate_domain_ui == "" ? "http://${aws_alb.ui.dns_name}" : "https://${aws_alb.ui.dns_name}"
}

# Number of container instances to spawn per resource. Default is 1. 
locals {
  dev_ui     = substr(terraform.workspace, 0, 4) == "dev-" ? 1 : 0
  master_ui  = terraform.workspace == "master" ? 1 : 0
  staging_ui = terraform.workspace == "staging" ? 1 : 0
  prod_ui    = terraform.workspace == "prod" ? 3 : 0

  count_ui         = local.dev_ui + local.master_ui + local.staging_ui + local.prod_ui
  desired_count_ui = local.count_ui > 0 ? local.count_ui : 1
}

data "aws_ecr_repository" "react" {
  name = "react"
}

resource "aws_ecs_task_definition" "ui" {
  family                   = "ui-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_ui.json.tpl", {
    image                    = "${data.aws_ecr_repository.react.repository_url}:${var.application_version}",
    api_url                  = local.endpoint_api_postgres
    cloudwatch_log_group     = aws_cloudwatch_log_group.frontend.name
    cloudwatch_stream_prefix = "ui",
  })
}

resource "aws_security_group" "ui" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "ui_ingress_80" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_ui.id
  security_group_id        = aws_security_group.ui.id
}

resource "aws_security_group_rule" "ui_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.ui.id
}

resource "aws_ecs_service" "ui" {
  name            = "ui"
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.ui.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = local.desired_count_ui
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.ui.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.ui.arn
    container_name   = "ui"
    container_port   = 80
  }
  deployment_minimum_healthy_percent = local.deployment_minimum_healthy_percent
}

resource "null_resource" "wait_for_ecs_stability_ui" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.ui.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.frontend.name} --services ${aws_ecs_service.ui.name}"
  }
  depends_on = [aws_ecs_service.ui]
}


resource "aws_security_group" "alb_ui" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_ui_egress" {
  type                     = "egress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.ui.id
  security_group_id        = aws_security_group.alb_ui.id
}

resource "aws_security_group_rule" "alb_ui_ingress_80" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_ui.id
}

resource "aws_security_group_rule" "alb_ui_ingress_443" {
  count             = var.acm_certificate_domain_ui == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_ui.id
}

resource "aws_alb" "ui" {
  name            = "ui-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_ui.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "ui" {
  name                 = "ui-target-group-${terraform.workspace}"
  port                 = 80
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "1"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.ui]
}

data "aws_acm_certificate" "ui" {
  count    = var.acm_certificate_domain_ui == "" ? 0 : 1
  domain   = var.acm_certificate_domain_ui
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_ui" {
  count             = var.acm_certificate_domain_ui == "" ? 0 : 1
  load_balancer_arn = aws_alb.ui.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.ui[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.ui.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_ui" {
  count             = var.acm_certificate_domain_ui == "" ? 1 : 0
  load_balancer_arn = aws_alb.ui.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.ui.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_ui" {
  count             = var.acm_certificate_domain_ui == "" ? 0 : 1
  load_balancer_arn = aws_alb.ui.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.ui.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}
