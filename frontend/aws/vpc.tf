locals {
  private_tags = local.is_legacy_account ? { Type = "private" } : { use = "private" }
  public_tags  = local.is_legacy_account ? { Type = "public" } : { use = "public" }
  private_filters = local.is_legacy_account ? [{
    name = "tag:aws:cloudformation:logical-id"
    # The tags are named slightly differently between environments.
    # Dev/Val1 - DmzSubnetAz2/3
    # Prod/Test/CM - DmzSubnet2/3
    values = ["AppSubnetAz2", "AppSubnetAz3", "AppSubnet2", "AppSubnet3"]
  }] : []
  public_filters = local.is_legacy_account ? [{
    name = "tag:aws:cloudformation:logical-id"
    # The tags are named slightly differently between environments.
    # Dev/Val1 - DmzSubnetAz2/3
    # Prod/Test/CM - DmzSubnet2/3
    values = ["DmzSubnetAz2", "DmzSubnetAz3", "DmzSubnet2", "DmzSubnet3"]
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
  dynamic "filter" {
    for_each = local.public_filters
    content {
      name   = filter.value["name"]
      values = filter.value["values"]
    }
  }
}
