
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
variable "region" {
  default="us-east-1"
}
// variable "s3_bucket" {
//   type = string
//   description = "(optional) describe your variable"
//   default="cms-cloud-730373213083-us-east-1-legacy"
// }
variable "enable_log_waf_acl" {
  description = "Should logging be enabled on WAF ACL or not? Default is FALSE to not create"
  default = true
}