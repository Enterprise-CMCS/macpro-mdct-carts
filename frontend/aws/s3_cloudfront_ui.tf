
resource "aws_s3_bucket" "ui" {
  bucket = "carts-ui-${terraform.workspace}"
  acl = "private"
  versioning {
    enabled = true
  }

  tags {
    Name = "carts-cloudfront-bucket"
  }
}
