
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
variable "acm_cert_arn"{
default= "arn:aws:acm:us-east-1:730373213083:certificate/0ee49785-ebd8-41fb-b401-7393a9a3d7c1"
}
