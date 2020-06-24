
variable "application_version" {}
variable "ecr_repository_url_ui" {}
variable "ecr_repository_url_api_postgres" {}
variable "ecr_repository_url_api_sqlserver" {}
variable "postgres_user" {}
variable "postgres_password" {}
variable "vpc_name" {}
variable "acm_certificate_domain_ui" {
  default = ""
}
variable "acm_certificate_domain_api_postgres" {
  default = ""
}
variable "acm_certificate_domain_api_sqlserver" {
  default = ""
}
