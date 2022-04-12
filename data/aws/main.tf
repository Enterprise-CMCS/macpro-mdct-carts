provider "aws" {
  region = "us-east-1"

}

terraform {
  required_providers {
    aws = {
      version = "3.58.0"
      source  = "hashicorp/aws"
    }
    null = {
      version = "3.1.1"
      source  = "hashicorp/null"
    }
  }
  backend "s3" {
    key     = "tf_state/application/data"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "random" {

}

provider "null" {

}
