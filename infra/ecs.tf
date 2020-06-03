locals {
  deployment_minimum_healthy_percent = terraform.workspace == "prod" ? 100 : 0
}

resource "aws_ecs_cluster" "application" {
  name               = terraform.workspace
  capacity_providers = ["FARGATE"]
}

resource "aws_iam_role" "ecs_task" {
  name               = "ui-ecs-task-role-${terraform.workspace}"
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_role" "ecs_execution_role" {
  name               = "ui-ecs-execution-role-${terraform.workspace}"
  assume_role_policy = file("files/assume-role-policy-ecs-tasks.json")
}

resource "aws_iam_policy" "execution_policy" {
  name   = "ecs_execution_policy_${terraform.workspace}"
  policy = file("files/ecs_execution_policy.json")
}

resource "aws_iam_role_policy_attachment" "execution" {
  role       = aws_iam_role.ecs_execution_role.id
  policy_arn = aws_iam_policy.execution_policy.arn
}


resource "aws_ecs_task_definition" "ui" {
  family                   = "service"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 1024
  memory                   = 4096
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_ui.json.tpl", {
    image = "${var.ecr_repository_url_ui}:${var.application_version}"
  })
}

resource "aws_security_group" "ui" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_ecs_service" "service" {
  name            = "ui"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.ui.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 3
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

resource "null_resource" "wait_for_ecs_stability" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.ui.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.application.name} --services ${aws_ecs_service.service.name}"
  }
  depends_on = [aws_ecs_service.service]
}


resource "aws_security_group" "alb" {
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_alb" "alb" {
  name            = "ui-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb.id]
  subnets         = module.vpc.public_subnets
}

resource "aws_alb_target_group" "ui" {
  name                 = "ui-target-group-${terraform.workspace}"
  port                 = 80
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = module.vpc.vpc_id

  depends_on = [aws_alb.alb]
}


resource "aws_alb_listener" "http_forward" {
  load_balancer_arn = aws_alb.alb.id
  port              = "80"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.ui.id
    type             = "forward"
  }
}
