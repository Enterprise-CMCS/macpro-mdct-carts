
variable "application_version" {}

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
