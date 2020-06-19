
variable "application_version" {}
variable "ecr_repository_url_ui" {}
variable "ecr_repository_url_api" {}
variable "postgres_user" {}
variable "postgres_password" {}
variable "vpc_name" {}
variable "acm_certificate_domain_ui" {
  default = ""
}
variable "acm_certificate_domain_api" {
  default = ""
}
