provider "aws" {
  version = "2.58.0"
  region  = "us-east-1"
}

terraform {
  backend "s3" {
    key     = "tf_state/application/saf"
    region  = "us-east-1"
    encrypt = true
  }
}

provider "random" {
  version = "2.2.0"
}

provider "null" {
  version = "2.1.0"
}
