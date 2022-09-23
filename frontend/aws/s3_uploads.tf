data "aws_cloudformation_stack" "uploads" {
  name = "uploads-${terraform.workspace}"
}

resource "aws_s3_bucket" "uploads" {
  bucket        = local.is_legacy_account ? "cartscms-uploads-${terraform.workspace}" : "carts-uploads-${terraform.workspace}"
  acl           = "private"
  force_destroy = terraform.workspace == "prod" ? false : true

  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm = "AES256"
      }
    }
  }
}

resource "aws_lambda_permission" "allow_bucket" {
  statement_id   = "AllowExecutionFromS3Bucket"
  action         = "lambda:InvokeFunction"
  function_name  = data.aws_cloudformation_stack.uploads.outputs["AvScanArn"]
  principal      = "s3.amazonaws.com"
  source_arn     = aws_s3_bucket.uploads.arn
  source_account = local.account_id
}

resource "aws_s3_bucket_public_access_block" "uploads" {
  bucket = aws_s3_bucket.uploads.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_notification" "avscan" {
  bucket = aws_s3_bucket.uploads.id

  lambda_function {
    lambda_function_arn = data.aws_cloudformation_stack.uploads.outputs["AvScanArn"]
    events              = ["s3:ObjectCreated:*"]
  }

  depends_on = [aws_lambda_permission.allow_bucket, aws_s3_bucket_policy.b]
}
resource "aws_s3_bucket_policy" "b" {
  bucket = aws_s3_bucket.uploads.id

  # Terraform's "jsonencode" function converts a
  # Terraform expression's result to valid JSON syntax.
  policy = jsonencode({
    Version = "2012-10-17"
    Id      = "MYBUCKETPOLICY"
    Statement = concat([
      {
        Sid       = "MustBeClean"
        Effect    = "Deny"
        Principal = "*"
        Action = [
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
        Sid       = "RestrictFiles"
        Effect    = "Deny"
        Principal = "*",
        Action = [
          "s3:PutObject"
        ]
        "NotResource" : [
          "${aws_s3_bucket.uploads.arn}/*.bmp",
          "${aws_s3_bucket.uploads.arn}/*.csv",
          "${aws_s3_bucket.uploads.arn}/*.doc",
          "${aws_s3_bucket.uploads.arn}/*.docx",
          "${aws_s3_bucket.uploads.arn}/*.gif",
          "${aws_s3_bucket.uploads.arn}/*.jpg",
          "${aws_s3_bucket.uploads.arn}/*.jpeg",
          "${aws_s3_bucket.uploads.arn}/*.odp",
          "${aws_s3_bucket.uploads.arn}/*.ods",
          "${aws_s3_bucket.uploads.arn}/*.odt",
          "${aws_s3_bucket.uploads.arn}/*.png",
          "${aws_s3_bucket.uploads.arn}/*.pdf",
          "${aws_s3_bucket.uploads.arn}/*.ppt",
          "${aws_s3_bucket.uploads.arn}/*.pptx",
          "${aws_s3_bucket.uploads.arn}/*.rtf",
          "${aws_s3_bucket.uploads.arn}/*.tif",
          "${aws_s3_bucket.uploads.arn}/*.tiff",
          "${aws_s3_bucket.uploads.arn}/*.txt",
          "${aws_s3_bucket.uploads.arn}/*.xls",
          "${aws_s3_bucket.uploads.arn}/*.xlsx"
        ]
      },
      {
        Sid       = "AllowSSLRequestsOnly"
        Effect    = "Deny"
        Principal = "*"
        Action = [
          "s3:*"
        ]
        Resource = [
          "${aws_s3_bucket.uploads.arn}/*",
          "${aws_s3_bucket.uploads.arn}"
        ]
        Condition = {
          Bool = {
            "aws:SecureTransport" = false
          }
        }
      }
      ],
      # Allow new accounts to access uploads bucket for legacy account
      local.is_legacy_account ? [
        {
          Sid    = "AllowNewAccountS3SyncObjects",
          Effect = "Allow",
          Principal = {
            AWS = "arn:aws:iam::${local.new_account_id}:root"
          }
          Action = [
            "s3:GetObject*"
          ]
          Resource = [
            "${aws_s3_bucket.uploads.arn}/*"
          ]
        },
        {
          Sid    = "AllowNewAccountS3SyncBucket",
          Effect = "Allow",
          Principal = {
            AWS = "arn:aws:iam::${local.new_account_id}:root"
          }
          Action = [
            "s3:ListBucket"
          ]
          Resource = [
            "${aws_s3_bucket.uploads.arn}"
          ]
        }
    ] : [])
  })
}
