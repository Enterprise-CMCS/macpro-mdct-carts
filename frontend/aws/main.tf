terraform {
  required_providers {
    aws = {
    version = "3.58.0"
    source  = "hashicorp/aws"
    }

  }
  backend "s3" {
    key     = "tf_state/application/pipeline"
    region  = "us-east-1"
    encrypt = true
  }
}
provider "aws" {
  region  = "us-east-1"
}
provider "null" {
  version = "2.1.0"
}
