
resource "aws_s3_bucket" "ui" {
  bucket = "cartsui-cloudfront-origin"
  acl = "private"
  versioning {
    enabled = true
  }
}
