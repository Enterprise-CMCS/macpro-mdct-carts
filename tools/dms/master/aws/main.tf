provider "aws" {
  version = "2.58.0"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    key     = "tf_state/carts/dms"
    bucket  = "macpro-terraform-state"
    region  = "us-east-1"
    encrypt = true
  }
}
