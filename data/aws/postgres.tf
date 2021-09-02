locals {
  vpn_cidr_blocks = {
    "master" = [
      "10.251.0.0/16",
      "10.252.0.0/16",
      "10.232.32.0/19"
    ]

    "staging" = [
      "10.251.0.0/16",
      "10.252.0.0/16",
      "10.232.32.0/19"
    ]

    "prod" = [
      "10.251.0.0/16",
      "10.252.0.0/16",
      "10.232.32.0/19"
    ]
  }
}

module "db" {
  source                  = "terraform-aws-modules/rds/aws"
  version                 = "~> 2.0"
  identifier              = "postgres-rf-${terraform.workspace}"
  engine                  = "postgres"
  engine_version          = "9.6"
  instance_class          = "db.t3.small"
  parameter_group_name    = aws_db_parameter_group.db_param_group.id
  allocated_storage       = 50
  storage_encrypted       = true
  name                    = var.postgres_db
  username                = var.postgres_user
  password                = random_password.postgres.result
  port                    = "5432"
  vpc_security_group_ids  = [aws_security_group.db.id]
  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = terraform.workspace == "prod"? 21:0
  tags = {
    Environment = terraform.workspace
  }
  subnet_ids                      = data.aws_subnet_ids.private.ids
  family                          = "postgres9.6"
  major_engine_version            = "9.6"
  final_snapshot_identifier       = "postgres-${terraform.workspace}"
  deletion_protection             = false
  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]
}

resource "aws_security_group" "db" {
  vpc_id = data.aws_vpc.app.id
}

# Models the VPN Private Security Group (aws:cloudformation:logical-id = PrivateVpnSg)
resource "aws_security_group_rule" "vpn" {
  type              = "ingress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  security_group_id = aws_security_group.db.id

  cidr_blocks = lookup(local.vpn_cidr_blocks, terraform.workspace, [
    "10.251.0.0/16",
    "10.252.0.0/16",
    "10.232.32.0/19"
  ])
}

resource "aws_db_parameter_group" "db_param_group" {
  name   = "rds-pg-${terraform.workspace}"

  family = "postgres9.6"

  parameter {
    name  = "pgaudit.role"
    value = "rds_pgaudit"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "pgaudit.log"
    value = "ALL"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements, pgaudit"
    apply_method = "pending-reboot"
  }

  parameter {
    name  = "log_min_duration_statement"
    value = "10000"
    apply_method = "pending-reboot"
  }
}

resource "random_password" "postgres" {
  length           = 10
  special          = true
  override_special = "*"
}

resource "aws_route53_zone" "database" {
  name = "database-${terraform.workspace}.local"
  vpc {
    vpc_id = data.aws_vpc.app.id
  }
}

resource "aws_route53_record" "postgres" {
  zone_id = aws_route53_zone.database.zone_id
  name    = "postgres.${aws_route53_zone.database.name}"
  type    = "CNAME"
  ttl     = "1"
  records = [module.db.this_db_instance_address]
}


resource "aws_ssm_parameter" "postgres_password" {
  name  = "/${terraform.workspace}/postgres_password"
  type  = "SecureString"
  value = random_password.postgres.result
}


resource "aws_ssm_parameter" "postgres_user" {
  name  = "/${terraform.workspace}/postgres_user"
  type  = "SecureString"
  value = module.db.this_db_instance_username
}


resource "aws_ssm_parameter" "postgres_host" {
  name = "/${terraform.workspace}/postgres_host"
  type = "SecureString"
  # MACPRO VPCs won't be able to resolve these private hosted zones.
  # These VPCs have custom dhcp option sets and I don't think we are allowed to edit.
  # value = aws_route53_record.postgres.fqdn
  value = module.db.this_db_instance_address
}


resource "aws_ssm_parameter" "postgres_db" {
  name  = "/${terraform.workspace}/postgres_db"
  type  = "SecureString"
  value = module.db.this_db_instance_name
}

resource "aws_ssm_parameter" "postgres_security_group" {
  name  = "/${terraform.workspace}/postgres_security_group"
  type  = "SecureString"
  value = aws_security_group.db.id
}
