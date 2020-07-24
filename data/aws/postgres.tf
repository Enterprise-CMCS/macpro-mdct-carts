
module "db" {
  source                  = "terraform-aws-modules/rds/aws"
  version                 = "~> 2.0"
  identifier              = "postgres-${terraform.workspace}"
  engine                  = "postgres"
  engine_version          = "9.6.9"
  instance_class          = "db.t3.small"
  allocated_storage       = 50
  storage_encrypted       = true
  name                    = var.postgres_db
  username                = var.postgres_user
  password                = random_password.postgres.result
  port                    = "5432"
  vpc_security_group_ids  = [aws_security_group.db.id]
  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 0
  tags = {
    Environment = terraform.workspace
  }
  subnet_ids                = data.aws_subnet_ids.private.ids
  family                    = "postgres9.6"
  major_engine_version      = "9.6"
  final_snapshot_identifier = "postgres-${terraform.workspace}"
  deletion_protection       = false
}

resource "aws_security_group" "db" {
  vpc_id = data.aws_vpc.app.id
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
  name  = "/${terraform.workspace}/postgres_host"
  type  = "SecureString"
  value = aws_route53_record.postgres.fqdn
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
