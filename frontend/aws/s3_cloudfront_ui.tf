
resource "aws_s3_bucket" "www" {

  bucket = "${var.www_domain_name}"
  acl    = "private"
}

  data "aws_iam_policy_document" "s3_policy" {
      statement {
        actions   = ["s3:GetObject"]
        resources = ["${aws_s3_bucket.www.arn}/*"]

        principals {
          type        = "AWS"
          identifiers = [aws_cloudfront_origin_access_identity.s3_origin_access_identity.iam_arn]
        }
      }
    }

    resource "aws_s3_bucket_policy" "www_bucket_policy" {
      bucket = aws_s3_bucket.www.id
      policy = data.aws_iam_policy_document.s3_policy.json
    }


    resource "aws_cloudfront_origin_access_identity" "s3_origin_access_identity" {
      comment = "carts s3 OAI"
    }


resource "aws_cloudfront_distribution" "www_distribution" {
  origin {

  s3_origin_config {
    origin_access_identity = aws_cloudfront_origin_access_identity.s3_origin_access_identity.cloudfront_access_identity_path
    }

    domain_name = aws_s3_bucket.www.bucket_regional_domain_name
    origin_id   = "${var.www_domain_name}"
  }

  enabled             = true
  default_root_object = "index.html"

  // All values are defaults from the AWS console.
  default_cache_behavior {
    viewer_protocol_policy = "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    // This needs to match the `origin_id` above.
    target_origin_id       = "${var.www_domain_name}"
    min_ttl                = 0
    default_ttl            = 86400
    max_ttl                = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }

  // Here we're ensuring we can hit this distribution using var.www_domain_name
  // rather than the domain name CloudFront gives us.

  // #aliases = ["${var.www_domain_name}"]

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  // We will use the cloudfront default cert in this code
  viewer_certificate {
    cloudfront_default_certificate = true
    ssl_support_method  = "sni-only"
  }
}
