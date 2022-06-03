
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

variable "postgres_restore_snapshot_id" {
  default     = null
  type        = string
  description = "The PostgreSQL database snapshot used to restore or recreate the database"
}

variable "postgres_deployer_registry_id" {
  default     = null
  type        = string
  description = "The AWS Account ID where the postgres deployer repository is located"
}
