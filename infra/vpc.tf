locals {
  vpc_cidr = "10.10.0.0/16"
}

data "aws_availability_zones" "available" {
  blacklisted_names = ["us-east-1e"]
}

resource "null_resource" "subnets" {
  count = length(data.aws_availability_zones.available.names)
  triggers = {
    private_subnet = cidrsubnet(local.vpc_cidr, 8, count.index + 1)
    public_subnet  = cidrsubnet(local.vpc_cidr, 8, count.index + 101)
  }
}

module "vpc" {
  source               = "terraform-aws-modules/vpc/aws"
  version              = "2.9.0"
  name                 = terraform.workspace
  cidr                 = local.vpc_cidr
  azs                  = data.aws_availability_zones.available.names
  private_subnets      = null_resource.subnets.*.triggers.private_subnet
  public_subnets       = null_resource.subnets.*.triggers.public_subnet
  enable_dns_hostnames = true
  enable_dns_support   = true
  enable_nat_gateway   = true
  single_nat_gateway   = true
  enable_s3_endpoint   = false
  private_subnet_tags = {
    "type" : "private"
  }
  public_subnet_tags = {
    "type" : "public"
  }
}
