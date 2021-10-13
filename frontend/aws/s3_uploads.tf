data "aws_cloudformation_stack" "uploads" {
  name = "uploads-${terraform.workspace}"
}

local {
  account_id = data.aws_caller_identity.current.account_id
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
  source_arn    = "arn:aws:s3::${local.account_id}:${aws_s3_bucket.uploads.bucket}"
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
      {
        Sid = "RestrictFiles"
        Effect = "Deny"
        Principal="*",
        Action=[
          "s3:PutObject"
          ]
      "NotResource": [
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.bmp",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.csv",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.doc",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.docx",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.gif",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.jpg",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.jpeg",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.odp",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.ods",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.odt",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.png",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.pdf",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.ppt",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.pptx",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.rtf",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.tif",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.tiff",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.txt",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.xls",
        "arn:aws:s3:::cartscms-uploads-${terraform.workspace}/*.xlsx"
        ]
      }
    ]
  })
}
