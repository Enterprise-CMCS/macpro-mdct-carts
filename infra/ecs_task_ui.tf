
resource "aws_ecs_task_definition" "ui" {
  family                   = "ui-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_ui.json.tpl", {
    image   = "${var.ecr_repository_url_ui}:${var.application_version}",
    api_url = "http://${aws_alb.api.dns_name}:${aws_alb_listener.http_forward_api.port}"
  })
}

resource "aws_security_group" "ui" {
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "ui_ingress" {
  type                     = "ingress"
  from_port                = 80
  to_port                  = 80
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_ui.id
  security_group_id        = aws_security_group.ui.id
}

resource "aws_ecs_service" "ui" {
  name            = "ui-${terraform.workspace}"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.ui.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 6
  network_configuration {
    subnets         = module.vpc.private_subnets
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
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.application.name} --services ${aws_ecs_service.ui.name}"
  }
  depends_on = [aws_ecs_service.ui]
}


resource "aws_security_group" "alb_ui" {
  vpc_id = module.vpc.vpc_id
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
  name            = "ui-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_ui.id]
  subnets         = module.vpc.public_subnets
}

resource "aws_alb_target_group" "ui" {
  name                 = "ui-target-group-${terraform.workspace}"
  port                 = 80
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = module.vpc.vpc_id

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
