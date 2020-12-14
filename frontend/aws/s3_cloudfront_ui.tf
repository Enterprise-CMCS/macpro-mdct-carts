
locals {
  # This should be revisited.  Rules should be defined so we can make assumptions to reduce logic.
  # In short though, if we haven't specified a certificate for the API, then we're assuming we're
  #   reaching the API over http... and to hit the API over http, we must not hit the UI over
  #   https.  This avoids the Mixed Content errors seen in the console with section G.
  endpoint_ui = var.acm_certificate_domain_api_postgres == "" ? "http://${aws_cloudfront_distribution.www_distribution.domain_name}" : "https://${var.acm_certificate_domain_ui}"
}

resource "aws_s3_bucket" "www" {

  bucket        = "cartsfrontendbucket-${terraform.workspace}"
  acl           = "private"
  force_destroy = true
  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = [local.endpoint_api_postgres]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
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
    origin_id   = "cartsfrontendbucket-${terraform.workspace}"
  }

  enabled             = true
  default_root_object = "index.html"
  web_acl_id          = aws_wafv2_web_acl.uiwaf.arn

  custom_error_response {
    error_caching_min_ttl = 3000
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }


  // All values are defaults from the AWS console.
  default_cache_behavior {
    # If the API is http, we will accept all traffic (including http) on cloudfront
    # This swerves the 'Mixed Content:' errors that occur when reaching the UI over
    #   https but asking the browser to hit the api over http
    # This allows the end user to hit the UI over http
    viewer_protocol_policy = var.acm_certificate_domain_api_postgres == "" ? "allow-all" : "redirect-to-https"
    compress               = true
    allowed_methods        = ["GET", "HEAD"]
    cached_methods         = ["GET", "HEAD"]
    // This needs to match the `origin_id` above.
    target_origin_id = "cartsfrontendbucket-${terraform.workspace}"
    min_ttl          = 0
    default_ttl      = 86400
    max_ttl          = 31536000

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
  }
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  aliases = var.acm_certificate_domain_ui == "" ? [] : [var.acm_certificate_domain_ui]

  viewer_certificate {
    cloudfront_default_certificate = var.acm_certificate_domain_ui == "" ? true : null
    acm_certificate_arn            = var.acm_certificate_domain_ui == "" ? null : data.aws_acm_certificate.ui[0].arn
    ssl_support_method             = "sni-only"
  }
}

data "aws_acm_certificate" "ui" {
  count    = var.acm_certificate_domain_ui == "" ? 0 : 1
  domain   = var.acm_certificate_domain_ui
  statuses = ["ISSUED"]
}

resource "aws_wafv2_web_acl" "uiwaf" {
  name        = "uiwaf-${terraform.workspace}"
  description = "WAF for cloudfront distro"
  scope       = "CLOUDFRONT"

  default_action {
    block {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${terraform.workspace}-webacl"
    sampled_requests_enabled   = true
  }

  rule {
    name     = "${terraform.workspace}-DDOSRateLimitRule"
    priority = 0
    action {
      count {}
    }

    statement {
      rate_based_statement {
        limit              = 5000
        aggregate_key_type = "IP"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${terraform.workspace}-DDOSRateLimitRuleMetric"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-RegAWSCommonRule"
    priority = 1

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesCommonRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${terraform.workspace}-RegAWSCommonRuleMetric"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-AWSManagedRulesAmazonIpReputationList"
    priority = 2

    override_action {
      none {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesAmazonIpReputationList"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${terraform.workspace}-RegAWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-RegAWSManagedRulesKnownBadInputsRuleSet"
    priority = 3

    override_action {
      count {}
    }

    statement {
      managed_rule_group_statement {
        vendor_name = "AWS"
        name        = "AWSManagedRulesKnownBadInputsRuleSet"
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${terraform.workspace}-RegAWS-AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "${terraform.workspace}-allow-usa-plus-territories"
    priority = 5
    action {
      allow {}
    }

    statement {
      geo_match_statement {
        country_codes = ["US", "GU", "PR", "UM", "VI", "MP"]
      }
    }

    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "${terraform.workspace}-geo-rule"
      sampled_requests_enabled   = true
    }
  }
}
