variable "team_name" {}

variable "application" {}

variable "environment-name" {}

variable "business-unit" {
  description = "Area responsible for the service"
  default     = "DevOps"
}

variable "engine_type" {
  description = "Engine used e.g. postgres"
  default     = "postgres"
}

variable "engine_version" {
  description = "The engine version to use e.g. 9.6"
  default     = "9.6"
}

variable "instance_type" {
  description = "replication instance size, e.g dms.c4.large"
  default     = "dms.c4.large"
}

variable "aws_region" {
  description = "Region into which the resource will be created."
  default     = "us-east-1"
}

variable "source_database_name_carts" {
  description = "Name of source database (psql -d)"
}

variable "source_database_name_seds" {
  description = "Name of source database (psql -d)"
}

variable "source_database_name_mbescbes" {
  description = "Name of source database (psql -d)"
}

variable "source_database_username" {
  description = "username in source database (psql -U)"
}

variable "source_database_password" {
  description = "user's password in source database"
}

variable "source_database_port" {
  description = "port in source database"
}

variable "source_database_host" {
  description = "host, endpoint of source database (psql -h)"
}

variable "target_database_name" {
  description = "Name of target database (psql -d)"
}

variable "target_database_username" {
  description = "username in target database (psql -U)"
}

variable "target_database_password" {
  description = "user's password in target database (psql -d)"
}

variable "target_database_host" {
  description = "host, endpoint of target database (psql -d)"
}

variable "subnet_ids" {
  description = "A list of the EC2 subnet IDs for the subnet group"
}

variable "vpc_id" {
  description = "VPC ID for replication instance security group"
}

variable "security_group_ids" {
  description = "Security Group IDs for replication instance"
}
