
variable "application_version" {}

variable "vpc_name" {}

variable "datalayer_aws_access_key" {
  type      = string
  sensitive = true
}

variable "datalayer_aws_secret_key" {
  type      = string
  sensitive = true
}

variable "datalayer_aws_session_token" {
  type      = string
  sensitive = true
}

variable "acm_certificate_domain_ui" {
  default = ""
}
variable "acm_certificate_domain_api_postgres" {
  default = ""
}
variable "openid_discovery_url" {
  default = "https://test.idp.idm.cms.gov/oauth2/aus4itu0feyg3RJTK297/.well-known/openid-configuration"
}

variable "prince_api_endpoint" {
  default = "not set"
}
variable "region" {
  default = "us-east-1"
}
// variable "s3_bucket" {
//   type = string
//   description = "(optional) describe your variable"
//   default="cms-cloud-730373213083-us-east-1-legacy"
// }
variable "enable_log_waf_acl" {
  description = "Should logging be enabled on WAF ACL or not? Default is FALSE to not create"
  default     = true
}

variable "use_custom_db_user_info" {
  default = false
}

variable "use_custom_db_password_info" {
  default = false
}

variable "postgres_django_registry_id" {
  default     = null
  type        = string
  description = "The AWS Account ID where the postgres django repository is located"
}
