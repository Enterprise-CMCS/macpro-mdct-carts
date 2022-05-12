terraform {
  required_providers {
    aws = {
      version = "3.75.1"
      source  = "hashicorp/aws"
    }
    null = {
      version = "3.1.1"
      source  = "hashicorp/null"
    }
  }
  backend "s3" {
    key     = "tf_state/application/pipeline"
    region  = "us-east-1"
    encrypt = true
  }
}
provider "aws" {
  region = "us-east-1"
}
provider "aws" {
  alias      = "datalayer"
  access_key = var.datalayer_aws_access_key
  secret_key = var.datalayer_aws_secret_key
  token      = var.datalayer_aws_session_token
  region     = "us-east-1"
}
provider "null" {

}
