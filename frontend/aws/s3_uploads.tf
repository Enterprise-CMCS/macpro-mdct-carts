
resource "aws_s3_bucket" "uploads" {

  bucket        = "cartscms-uploads-${terraform.workspace}"
  acl           = "public"
  force_destroy = terraform.workspace == "prod" ? false : true
}
