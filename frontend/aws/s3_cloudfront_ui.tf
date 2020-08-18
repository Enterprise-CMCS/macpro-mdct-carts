
#resource "aws_s3_bucket" "ui" {
#  bucket = "cartsui-cloudfrontorigin"
#  acl = "private"
#  versioning {
#    enabled = true
#  }
#}

locals {
  endpoint_ui = var.acm_certificate_domain_ui == "" ? "http://${aws_alb.ui.dns_name}" : "https://${aws_alb.ui.dns_name}"
}


# s3 Bucket with Website settings
resource "aws_s3_bucket" "site_bucket" {
  bucket = "cartsui-origin-${terraform.workspace}"
  acl = "public-read"
  website {
    index_document = "index.html"
#    error_document = "error.html"
  }
}
# cloudfront distribution
resource "aws_cloudfront_distribution" "site_distribution" {
  origin {
    domain_name = "${aws_s3_bucket.site_bucket.bucket_domain_name}"
    origin_id = "cartsui-origin-${terraform.workspace}"
  }
  enabled = true
  aliases = ["${terraform.workspace}"]
  price_class = "PriceClass_100"
  default_root_object = "index.html"
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH",
                      "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "cartsui-origin-${terraform.workspace}"
     forwarded_values {
      query_string = true
      cookies {
        forward = "all"
      }
    }
    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 1000
    max_ttl                = 86400
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  viewer_certificate {
    acm_certificate_arn = "var.acm_certificate_domain_ui"
    ssl_support_method  = "sni-only"
    minimum_protocol_version = "TLSv1.1_2016" # defaults wrong, set
  }
}
