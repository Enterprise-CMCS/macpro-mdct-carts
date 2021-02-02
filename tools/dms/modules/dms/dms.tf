data "aws_ssm_parameter" "postgres_security_group" {
  name = "/${terraform.workspace}/postgres_security_group"
}

resource "aws_security_group" "replication_instance" {
  name   = "replication_instance-${terraform.workspace}"
  vpc_id = var.vpc_id
}

# # Outbound, for target (postgres)
resource "aws_security_group_rule" "replication_instance_outbound" {
  type              = "egress"
  from_port         = 5432
  to_port           = 5432
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.replication_instance.id
}

# # Inbound, for source (SQL Server)
resource "aws_security_group_rule" "replication_instance_inbound" {
  type              = "ingress"
  from_port         = var.source_database_port
  to_port           = var.source_database_port
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.replication_instance.id
}

resource "random_id" "id" {
  byte_length = 8
}

# Create a new replication subnet group
resource "aws_dms_replication_subnet_group" "replication-subnet-group" {
  replication_subnet_group_description = "Replication subnet group for ${var.application}"
  replication_subnet_group_id          = "dms-subnet-group-${var.application}-${terraform.workspace}"

  subnet_ids = var.subnet_ids

  tags = {
    Name        = "${var.team_name} DMS subnet group"
    Description = "Managed by Terraform"
    Env         = var.environment-name
    Owner       = var.team_name
  }
}

# Create a new replication instance
resource "aws_dms_replication_instance" "replication-instance" {
  allocated_storage           = 50
  apply_immediately           = true
  auto_minor_version_upgrade  = true
  engine_version              = "3.4.0"
  publicly_accessible         = false
  replication_instance_class  = "dms.c4.large"
  replication_instance_id     = "dms-replication-instance-${var.application}-${terraform.workspace}"
  replication_subnet_group_id = aws_dms_replication_subnet_group.replication-subnet-group.id

  tags = {
    Name        = "${var.team_name} Replication Instance"
    Description = "Managed by Terraform"
    Env         = var.environment-name
    Application = var.application
    Owner       = var.team_name
  }

  vpc_security_group_ids = concat(
    [aws_security_group.replication_instance.id],
    var.security_group_ids
  )
}

# Create new source endpoints
resource "aws_dms_endpoint" "source-carts" {
  endpoint_id                 = "dms-source-endpoint-${var.application}-${terraform.workspace}-carts"
  endpoint_type               = "source"
  engine_name                 = "sqlserver"
  extra_connection_attributes = ""
  server_name                 = var.source_database_host
  database_name               = var.source_database_name_carts
  username                    = var.source_database_username
  password                    = var.source_database_password
  port                        = var.source_database_port
  ssl_mode                    = "none"

  tags = {
    Name        = "${var.team_name} Source Endpoint"
    Description = "Managed by Terraform"
    Application = var.application
    Owner       = var.team_name
    Env         = var.environment-name
  }
}

resource "aws_dms_endpoint" "source-seds" {
  endpoint_id                 = "dms-source-endpoint-${var.application}-${terraform.workspace}-seds"
  endpoint_type               = "source"
  engine_name                 = "sqlserver"
  extra_connection_attributes = ""
  server_name                 = var.source_database_host
  database_name               = var.source_database_name_seds
  username                    = var.source_database_username
  password                    = var.source_database_password
  port                        = var.source_database_port
  ssl_mode                    = "none"

  tags = {
    Name        = "${var.team_name} Source Endpoint"
    Description = "Managed by Terraform"
    Application = var.application
    Owner       = var.team_name
    Env         = var.environment-name
  }
}

resource "aws_dms_endpoint" "source-mbescbes" {
  endpoint_id                 = "dms-source-endpoint-${var.application}-${terraform.workspace}-mbescbes"
  endpoint_type               = "source"
  engine_name                 = "sqlserver"
  extra_connection_attributes = ""
  server_name                 = var.source_database_host
  database_name               = var.source_database_name_mbescbes
  username                    = var.source_database_username
  password                    = var.source_database_password
  port                        = var.source_database_port
  ssl_mode                    = "none"

  tags = {
    Name        = "${var.team_name} Source Endpoint"
    Description = "Managed by Terraform"
    Application = var.application
    Owner       = var.team_name
    Env         = var.environment-name
  }
}

# Create a new target endpoint
resource "aws_dms_endpoint" "target" {
  endpoint_id                 = "dms-target-endpoint-${var.application}-${terraform.workspace}"
  endpoint_type               = "target"
  engine_name                 = "postgres"
  extra_connection_attributes = ""
  server_name                 = var.target_database_host
  database_name               = var.target_database_name
  username                    = var.target_database_username
  password                    = var.target_database_password
  port                        = 5432
  ssl_mode                    = "none"

  tags = {
    Name        = "${var.team_name} Target Endpoint"
    Description = "Managed by Terraform"
    Application = var.application
    Env         = var.environment-name
    Owner       = var.team_name
  }
}

data "local_file" "replication-table-mappings-carts" {
  filename = "${path.module}/resources/table-mappings-carts.json"
}

data "local_file" "replication-table-mappings-seds" {
  filename = "${path.module}/resources/table-mappings-seds.json"
}

data "local_file" "replication-table-mappings-mbescbes" {
  filename = "${path.module}/resources/table-mappings-mbescbes.json"
}

data "local_file" "replication-tasks-settings" {
  filename = "${path.module}/resources/settings.json"
}

# Create new replication tasks
resource "aws_dms_replication_task" "replication-task-carts" {
  migration_type           = "full-load"
  replication_instance_arn = aws_dms_replication_instance.replication-instance.replication_instance_arn
  replication_task_id      = "dms-replication-task-${var.application}-${terraform.workspace}-carts"

  source_endpoint_arn = aws_dms_endpoint.source-carts.endpoint_arn
  target_endpoint_arn = aws_dms_endpoint.target.endpoint_arn

  table_mappings            = data.local_file.replication-table-mappings-carts.content
  replication_task_settings = data.local_file.replication-tasks-settings.content

  tags = {
    Name        = "${var.team_name} Replication Task"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

# Create a new replication task
resource "aws_dms_replication_task" "replication-task-seds" {
  migration_type           = "full-load"
  replication_instance_arn = aws_dms_replication_instance.replication-instance.replication_instance_arn
  replication_task_id      = "dms-replication-task-${var.application}-${terraform.workspace}-seds"

  source_endpoint_arn = aws_dms_endpoint.source-seds.endpoint_arn
  target_endpoint_arn = aws_dms_endpoint.target.endpoint_arn

  table_mappings            = data.local_file.replication-table-mappings-seds.content
  replication_task_settings = data.local_file.replication-tasks-settings.content

  tags = {
    Name        = "${var.team_name} Replication Task"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

# Create a new replication task
resource "aws_dms_replication_task" "replication-task-mbescbes" {
  migration_type           = "full-load"
  replication_instance_arn = aws_dms_replication_instance.replication-instance.replication_instance_arn
  replication_task_id      = "dms-replication-task-${var.application}-${terraform.workspace}-mbescbes"

  source_endpoint_arn = aws_dms_endpoint.source-mbescbes.endpoint_arn
  target_endpoint_arn = aws_dms_endpoint.target.endpoint_arn

  table_mappings            = data.local_file.replication-table-mappings-mbescbes.content
  replication_task_settings = data.local_file.replication-tasks-settings.content

  tags = {
    Name        = "${var.team_name} Replication Task"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

# Modify target security group to allow inbound traffic from DMS (postgres)
resource "aws_security_group_rule" "postgres_ingress_from_api_postgres" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.replication_instance.id
  security_group_id        = data.aws_ssm_parameter.postgres_security_group.value
}

# Setup notifications for the SEDS nightly DMS job
# TO email addresses must be configured through the AWS SNS console
resource "aws_sns_topic" "seds-topic" {
  name = "topic-${var.application}-${terraform.workspace}-seds"

  tags = {
    Name        = "${var.team_name} Replication Task"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

resource "aws_dms_event_subscription" "seds-notification-task" {
  enabled          = true
  # All options: ["failure", "configuration change", "deletion", "state change", "creation"]
  event_categories = ["failure"]
  name             = "dms-event-task-${var.application}-${terraform.workspace}-seds"
  sns_topic_arn    = aws_sns_topic.seds-topic.arn
  source_ids       = [aws_dms_replication_task.replication-task-seds.replication_task_id]
  source_type      = "replication-task"

  tags = {
    Name        = "${var.team_name} Replication Task Notifications"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

resource "aws_dms_event_subscription" "notification-instance" {
  enabled          = true
  # All options: ["failure", "configuration change", "low storage", "failover", "deletion", "creation", "maintenance"]
  event_categories = ["failure"]
  name             = "dms-event-instance-${var.application}-${terraform.workspace}"
  sns_topic_arn    = aws_sns_topic.seds-topic.arn
  source_ids       = [aws_dms_replication_instance.replication-instance.replication_instance_id]
  source_type      = "replication-instance"

  tags = {
    Name        = "${var.team_name} Replication Instance Notifications"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

############### Adding codes for the automated trigger of DMS event
/*
DMS event subscription 
Creates the DMS event subscription that monitors "state change" of a replication task & sends the event to the 1st SNS topic 
*/
resource "aws_dms_event_subscription" "seds-statechange-notification" {
  enabled          = true
  event_categories = ["state change"]
  name             = "dms-event-statechange-${var.application}-${terraform.workspace}-seds"
  sns_topic_arn    = aws_sns_topic.seds_statechange_topic.arn
  source_ids       = [aws_dms_replication_task.replication-task-seds.replication_task_id]
  source_type      = "replication-task"

  tags = {
    Name        = "${var.team_name} Replication StateChange Notifications"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}

/*
1st SNS Topic
Receives event from the DMS event subscription on status change & triggers a 1st lambda function
*/
resource "aws_sns_topic" "seds_statechange_topic" {
  name = "topic-${var.application}-${terraform.workspace}-lambda-seds"

  tags = {
    Name        = "${var.team_name} Replication StateChange"
    Owner       = var.team_name
    Application = var.application
    Description = "Managed by Terraform"
    Env         = var.environment-name
  }
}
resource "aws_sns_topic_subscription" "seds_sns_topic_sub" {
  topic_arn = aws_sns_topic.seds_statechange_topic.arn
  protocol = "lambda"
  endpoint = aws_lambda_function.dms_event_lambda.arn
}
resource "aws_lambda_permission" "seds_allow_sns_lambda" {
  statement_id  = "AllowExecutionFromSNS"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.dms_event_lambda.function_name
  principal     = "sns.amazonaws.com"
  source_arn    = aws_sns_topic.seds_statechange_topic.arn
}

/*
Lambda Function Role
Has the Lambda basic execution policy attached to it, so it can send its logs to CWLogs
*/
resource "aws_iam_role" "seds_lambda_role" {
  name = "lambda"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_policy" "ssm_policy" {
  name = "get_ssm_parameters"
  path = "/"
  description = "gives permission to get ssm parameters"

  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": [
        "ssm:Get*"
      ],
      "Effect": "Allow",
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "dms_event_lambda_attachment" {
  role       = aws_iam_role.seds_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}
resource "aws_iam_role_policy_attachment" "vpc_access_lambda_attachment" {
  role       = aws_iam_role.seds_lambda_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaVPCAccessExecutionRole"
}
resource "aws_iam_role_policy_attachment" "ssm_policy_attachment" {
  role       = aws_iam_role.seds_lambda_role.name
  policy_arn = aws_iam_policy.ssm_policy.arn
}

/*
1st Lambda Function
is triggered by the 1st SNS Topic, and prints out the events/logs to CWLogs (/aws/lambda/dms_event_lambda)
*/
resource "aws_lambda_function" "dms_event_lambda" {
  filename      = "./dms_event_lambda.zip"
  function_name = "dms_event_lambda"
  role          = aws_iam_role.seds_lambda_role.arn
  handler       = "dms_event_lambda.handler"
  runtime = "python3.7"
}

locals {
  lg_name = "/aws/lambda/${aws_lambda_function.dms_event_lambda.function_name}"
}

/*
Log Group for the 1st lambda
*/
resource "aws_cloudwatch_log_group" "dms_event_lambda_lg" {
  name = local.lg_name
}

/*
2nd Lambda Function
is triggered by the CloudWatch Logs Subscription filter and starts the next DMS migration task
*/
resource "aws_lambda_function" "start_dms_lambda" {
  filename      = "./start_dms.zip"
  function_name = "start_dms"
  role          = aws_iam_role.seds_lambda_role.arn
  handler       = "start_dms.handler"
  runtime = "nodejs10.x"
  vpc_config {
    subnet_ids         = var.subnet_ids
    security_group_ids = [aws_security_group.start_dms_lambda_sg.id]
  }
}

# Permission for cloudwatch to trigger the 2nd Lambda function
resource "aws_lambda_permission" "allow_cloudwatch" {
  statement_id  = "AllowExecutionFromCW"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.start_dms_lambda.function_name
  principal     = "logs.amazonaws.com"
  source_arn = "${aws_cloudwatch_log_group.dms_event_lambda_lg.arn}:*"
}
/*
CloudWatch Logs Subscription Filters
*/
resource "aws_cloudwatch_log_subscription_filter" "lambdafunction_logfilter" {
  depends_on = [aws_lambda_permission.allow_cloudwatch]
  name            = "dms-full-load"
  log_group_name  = local.lg_name
  filter_pattern  = "Replication task has stopped. Stop Reason FULL_LOAD_ONLY_FINISHED."
  destination_arn = aws_lambda_function.start_dms_lambda.arn
}

resource "aws_security_group" "start_dms_lambda_sg" {
  name   = "start_dms_lambda-${terraform.workspace}-sg"
  vpc_id = var.vpc_id
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

}

# # VPC Endpoint, for SSM
resource "aws_vpc_endpoint" "ssm" {
  vpc_id            = var.vpc_id
  service_name      = "com.amazonaws.us-east-1.ssm"
  vpc_endpoint_type = "Interface"
  security_group_ids = [aws_security_group.ssm_vpc_endpoint_sg.id]
  subnet_ids = var.subnet_ids
  private_dns_enabled = true
}

resource "aws_security_group" "ssm_vpc_endpoint_sg" {
  name   = "ssm_vpc_endpoint-${terraform.workspace}-sg"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    security_groups = [aws_security_group.start_dms_lambda_sg.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}