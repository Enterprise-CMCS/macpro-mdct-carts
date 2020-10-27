
variable "application_version" {}

variable "vpc_name" {}

variable "acm_certificate_domain_ui" {
  default = ""
}
variable "acm_certificate_domain_api_postgres" {
  default = ""
}
variable "openid_discovery_url" {
  default = "https://test.idp.idm.cms.gov/oauth2/aus4itu0feyg3RJTK297/.well-known/openid-configuration"
}
