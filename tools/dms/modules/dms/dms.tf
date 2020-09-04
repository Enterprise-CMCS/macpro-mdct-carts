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

  vpc_security_group_ids = [
    aws_security_group.replication_instance.id
  ]
}

# Create a new source endpoint
resource "aws_dms_endpoint" "source" {
  endpoint_id                 = "dms-source-endpoint-${var.application}-${terraform.workspace}"
  endpoint_type               = "source"
  engine_name                 = "sqlserver"
  extra_connection_attributes = ""
  server_name                 = var.source_database_host
  database_name               = var.source_database_name
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

data "local_file" "replication-table-mappings" {
  filename = "${path.module}/resources/table-mappings.json"
}

data "local_file" "replication-tasks-settings" {
  filename = "${path.module}/resources/settings.json"
}

# Create a new replication task
resource "aws_dms_replication_task" "replication-task" {
  migration_type           = "full-load"
  replication_instance_arn = aws_dms_replication_instance.replication-instance.replication_instance_arn
  replication_task_id      = "dms-replication-task-${var.application}-${terraform.workspace}"

  source_endpoint_arn = aws_dms_endpoint.source.endpoint_arn
  target_endpoint_arn = aws_dms_endpoint.target.endpoint_arn

  table_mappings            = data.local_file.replication-table-mappings.content
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
