data "aws_vpc" "app" {
  tags = {
    Name = var.vpc_name
  }
}

data "aws_subnet_ids" "private" {
  vpc_id = data.aws_vpc.app.id
  tags = {
    Type = "private"
  }
  filter {
    name = "tag:aws:cloudformation:logical-id"
    # The tags are named slightly differently between environments.
    # Dev/Val1 - DmzSubnetAz2/3
    # Prod/Test/CM - DmzSubnet2/3
    values = ["AppSubnetAz2", "AppSubnetAz3", "AppSubnet2", "AppSubnet3"]
  }
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.app.id
  tags = {
    Type = "public"
  }
  filter {
    name = "tag:aws:cloudformation:logical-id"
    # The tags are named slightly differently between environments.
    # Dev/Val1 - DmzSubnetAz2/3
    # Prod/Test/CM - DmzSubnet2/3
    values = ["DmzSubnetAz2", "DmzSubnetAz3", "DmzSubnet2", "DmzSubnet3"]
  }
}
