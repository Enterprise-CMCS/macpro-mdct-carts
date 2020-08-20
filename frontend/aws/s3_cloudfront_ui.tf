// Create a variable for our domain name because we'll be using it a lot.
variable "www_domain_name" {
  default = "www.carts-demo1.com"

}

// We'll also need the root domain (also known as zone apex or naked domain).
//variable "root_domain_name" {
//  default = "carts-demo1.com"
//}



resource "aws_s3_bucket" "www" {
  // Our bucket's name is going to be the same as our site's domain name.
  bucket = "${var.www_domain_name}"
  acl    = "public-read"

  policy = <<POLICY
 {
   "Version":"2012-10-17",
   "Statement":[
     {
       "Sid":"AddPerm",
       "Effect":"Allow",
       "Principal": "*",
       "Action":["s3:GetObject"],
       "Resource":["arn:aws:s3:::${var.www_domain_name}/*"]
     }
   ]
 }
 POLICY
 
  website {
    index_document = "index.html"
  //  error_document = "404.html"
  }
}

resource "aws_cloudfront_distribution" "www_distribution" {
  origin {
    custom_origin_config {
      // These are all the defaults.
      http_port              = "80"
      https_port             = "443"
      origin_protocol_policy = "http-only"
      origin_ssl_protocols   = ["TLSv1", "TLSv1.1", "TLSv1.2"]
    }

    // Here we're using our S3 bucket's URL!
    domain_name = "${aws_s3_bucket.www.website_endpoint}"
    // This can be any name to identify this origin.
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
  // #acm_certificate_arn = "${aws_acm_certificate.certificate.arn}"
    cloudfront_default_certificate = true
    ssl_support_method  = "sni-only"
  }
}
