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
}

data "aws_subnet_ids" "public" {
  vpc_id = data.aws_vpc.app.id
  tags = {
    Type = "public"
  }
}
