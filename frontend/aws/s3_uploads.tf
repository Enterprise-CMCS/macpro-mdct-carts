data "aws_cloudformation_stack" "uploads" {
  name = "uploads-${terraform.workspace}"
}

resource "aws_s3_bucket" "uploads" {
  bucket        = "cartscms-uploads-${terraform.workspace}"
  acl           = "private"
  force_destroy = terraform.workspace == "prod" ? false : true
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = data.aws_cloudformation_stack.uploads.outputs["AvScanArn"]
  principal     = "s3.amazonaws.com"
  source_arn    = aws_s3_bucket.uploads.arn
}

resource "aws_s3_bucket_notification" "avscan" {
  bucket = aws_s3_bucket.uploads.id

  lambda_function {
    lambda_function_arn = data.aws_cloudformation_stack.uploads.outputs["AvScanArn"]
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_bucket]
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
