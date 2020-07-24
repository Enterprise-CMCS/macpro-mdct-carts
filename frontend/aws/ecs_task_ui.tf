
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
    api_url                  = "http://${aws_alb.api.dns_name}:${aws_alb_listener.http_forward_api.port}",
    cloudwatch_log_group     = aws_cloudwatch_log_group.frontend.name
    cloudwatch_stream_prefix = "ui",
  })
}

resource "aws_security_group" "ui" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "ui_ingress" {
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
  desired_count = 3
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
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port       = 80
    to_port         = 80
    protocol        = "tcp"
    security_groups = [aws_security_group.ui.id]
  }
}

resource "aws_alb" "ui" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  internal        = false
  security_groups = [aws_security_group.alb_ui.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "ui" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  port                 = 80
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.ui]
}


resource "aws_alb_listener" "http_forward_ui" {
  load_balancer_arn = aws_alb.ui.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.ui.id
    type             = "forward"
  }
}
