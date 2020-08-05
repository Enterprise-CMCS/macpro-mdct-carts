
resource "aws_s3_bucket" "ui" {
  bucket = "cartsUi-cloudfront-origin"
  acl = "private"
  versioning {
    enabled = true
  }
}
