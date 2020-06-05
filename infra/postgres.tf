
module "db" {
  source                  = "terraform-aws-modules/rds/aws"
  version                 = "~> 2.0"
  identifier              = "postgres-${terraform.workspace}"
  engine                  = "postgres"
  engine_version          = "9.6.9"
  instance_class          = "db.t3.large"
  allocated_storage       = 50
  storage_encrypted       = true
  name                    = "postgres"
  username                = var.postgres_user
  password                = var.postgres_password
  port                    = "5432"
  vpc_security_group_ids  = [aws_security_group.db.id]
  maintenance_window      = "Mon:00:00-Mon:03:00"
  backup_window           = "03:00-06:00"
  backup_retention_period = 0
  tags = {
    Environment = terraform.workspace
  }
  subnet_ids                = module.vpc.private_subnets
  family                    = "postgres9.6"
  major_engine_version      = "9.6"
  final_snapshot_identifier = "postgres-${terraform.workspace}"
  deletion_protection       = false
}

resource "aws_security_group" "db" {
  vpc_id = module.vpc.vpc_id
}

resource "aws_security_group_rule" "db_ingress" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api.id
  security_group_id        = aws_security_group.db.id
}
