resource "aws_s3_bucket" "uploads" {
  bucket        = "cartscms-uploads-${terraform.workspace}"
  acl           = "private"
  force_destroy = terraform.workspace == "prod" ? false : true
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["PUT", "POST", "GET"]
    allowed_origins = [local.endpoint_ui]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}