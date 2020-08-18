
#resource "aws_s3_bucket" "ui" {
#  bucket = "cartsui-cloudfrontorigin"
#  acl = "private"
#  versioning {
#    enabled = true
#  }
#}




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
    origin_id = "${aws_s3_bucket.site_bucket.id}"
  }
  enabled = true
  aliases = ["${terraform.workspace}"]
  price_class = "PriceClass_100"
  default_root_object = "index.html"
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH",
                      "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "${aws_s3_bucket.site_bucket.id}"
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
  #  acm_certificate_arn = "arn:aws:acm:us-east-1:730373213083:certificate/0ee49785-ebd8-41fb-b401-7393a9a3d7c1"
     cloudfront_default_certificate = true
     ssl_support_method  = "sni-only"
     minimum_protocol_version = "TLSv1.2_2019" # defaults wrong, set
   }
}
