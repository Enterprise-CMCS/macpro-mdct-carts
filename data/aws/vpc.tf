data "aws_caller_identity" "current" {}

locals {
  account_id        = data.aws_caller_identity.current.account_id
  is_legacy_account = local.account_id == "730373213083"
}

locals {
  private_tags = local.is_legacy_account ? { Type = "private" } : { use = "private" }
  public_tags  = local.is_legacy_account ? { Type = "public" } : { use = "public" }
  private_filters = local.is_legacy_account ? [{
    name   = "tag:vpc-conf-layer"
    values = ["data"]
  }] : []
}

data "aws_vpc" "app" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.app.id
  tags   = local.private_tags

  dynamic "filter" {
    for_each = local.private_filters
    content {
      name   = filter.value["name"]
      values = filter.value["values"]
    }
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.app.id
  tags   = local.public_tags
}
