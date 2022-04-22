
variable "application_version" {}

variable "vpc_name" {}

variable "postgres_user" {
  default = "pguser"
}

variable "postgres_db" {
  default = "postgres"
}

variable "skip_data_deployment" {
  default = false
}

variable "new_env_snapshot_id" {
  default = "postgres-rf-master-dev-migration-test"
}
