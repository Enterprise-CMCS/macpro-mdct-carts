data "aws_cloudformation_stack" "uploads" {
  name = "uploads-${terraform.workspace}"
}

resource "aws_s3_bucket" "uploads" {
  bucket        = "cartscms-uploads-${terraform.workspace}"
  acl           = "private"
  force_destroy = terraform.workspace == "prod" ? false : true
}

resource "aws_s3_bucket_policy" "b" {
  bucket = aws_s3_bucket.uploads.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression's result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "MYBUCKETPOLICY"
    Statement = [
      {
        Sid       = "MustBeClean"
        Effect    = "Deny"
        Principal = "*"
        Action    = [
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.uploads.arn}/*"

        Condition = {
          StringNotEquals = {
            "s3:ExistingObjectTag/virusScanStatus" = [
              "CLEAN"
            ],
            "aws:PrincipalArn" = data.aws_cloudformation_stack.uploads.outputs["BucketAVScanRoleArn"]
          }
        }
      },
    ]
  })
}
