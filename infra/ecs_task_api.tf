
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
    postgres_password = "weakPASSWORD"
  })
}

resource "aws_security_group" "api" {
  vpc_id = module.vpc.vpc_id
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

resource "aws_ecs_service" "api" {
  name            = "api-${terraform.workspace}"
  cluster         = aws_ecs_cluster.application.id
  task_definition = aws_ecs_task_definition.api.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 6
  network_configuration {
    subnets         = module.vpc.private_subnets
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
  vpc_id = module.vpc.vpc_id
  ingress {
    from_port   = 8000
    to_port     = 8000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  egress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.api.id]
  }
}

resource "aws_alb" "api" {
  name            = "api-alb-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api.id]
  subnets         = module.vpc.public_subnets
}

resource "aws_alb_target_group" "api" {
  name                 = "api-target-group-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = module.vpc.vpc_id

  depends_on = [aws_alb.api]
}


resource "aws_alb_listener" "http_forward_api" {
  load_balancer_arn = aws_alb.api.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api.id
    type             = "forward"
  }
}
