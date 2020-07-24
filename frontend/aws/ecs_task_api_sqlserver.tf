##############################################################################
# These values don't exist, as we don't have a MSSQL to hook into yet
##############################################################################
# data "aws_ssm_parameter" "sqlserver_user" {
#   name = "/${terraform.workspace}/sqlserver_user"
# }
#
# data "aws_ssm_parameter" "sqlserver_password" {
#   name = "/${terraform.workspace}/sqlserver_password"
# }
#
# data "aws_ssm_parameter" "sqlserver_host" {
#   name = "/${terraform.workspace}/sqlserver_host"
# }
#
# data "aws_ssm_parameter" "sqlserver_db" {
#   name = "/${terraform.workspace}/sqlserver_db"
# }
#
# data "aws_ssm_parameter" "sqlserver_security_group" {
#   name = "/${terraform.workspace}/sqlserver_security_group"
# }
##############################################################################

data "aws_ecr_repository" "sqlserver_django" {
  name = "sqlserver_django"
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
    image = "${data.aws_ecr_repository.sqlserver_django.repository_url}:${var.application_version}",
    # Until there is a MSSQL to hook into, we will pass placeholder values
    # sqlserver_host            = data.aws_ssm_parameter.sqlserver_host.value,
    # sqlserver_db              = data.aws_ssm_parameter.sqlserver_db.value,
    # sqlserver_user            = data.aws_ssm_parameter.sqlserver_user.value,
    # sqlserver_password        = data.aws_ssm_parameter.sqlserver_password.value,
    sqlserver_host           = "placeholder",
    sqlserver_db             = "placeholder",
    sqlserver_user           = "placeholder",
    sqlserver_password       = "placeholder",
    cloudwatch_log_group     = aws_cloudwatch_log_group.frontend.name,
    cloudwatch_stream_prefix = "api_sqlserver"
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

##############################################################################
# These values don't exist, as we don't have a MSSQL to hook into yet
##############################################################################
# resource "aws_security_group_rule" "api_sqlserver_egress" {
#   type                     = "egress"
#   from_port                = 1433
#   to_port                  = 1433
#   protocol                 = "tcp"
#   source_security_group_id = data.aws_ssm_parameter.sqlserver_security_group.value
#   security_group_id        = data.aws_ssm_parameter.sqlserver_security_group.value
# }
##############################################################################

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
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.api_sqlserver.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 3
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
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.frontend.name} --services ${aws_ecs_service.api_sqlserver.name}"
  }
  depends_on = [aws_ecs_service.api_sqlserver]
}


resource "aws_security_group" "alb_api_sqlserver" {
  vpc_id = data.aws_vpc.app.id
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
    security_groups = [aws_security_group.api_sqlserver.id]
  }
}

resource "aws_alb" "api_sqlserver" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  internal        = false
  security_groups = [aws_security_group.alb_api_sqlserver.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api_sqlserver" {
  # The name parameter for this resource has a length limit and is not required.  We won't specify a name.
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "0"
  vpc_id               = data.aws_vpc.app.id

  depends_on = [aws_alb.api_sqlserver]
}


resource "aws_alb_listener" "http_forward_api_sqlserver" {
  load_balancer_arn = aws_alb.api_sqlserver.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_sqlserver.id
    type             = "forward"
  }
}
