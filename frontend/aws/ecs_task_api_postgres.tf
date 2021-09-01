locals {
  endpoint_api_postgres = var.acm_certificate_domain_api_postgres == "" ? "http://${aws_alb.api_postgres.dns_name}:8000" : "https://${var.acm_certificate_domain_api_postgres}"
  django_settings_module = {
    "prod" : "carts.settings"
  }
}

data "aws_ssm_parameter" "postgres_user" {
  name = "/${terraform.workspace}/postgres_user"
}

data "aws_ssm_parameter" "postgres_password" {
  name = "/${terraform.workspace}/postgres_password"
}

data "aws_ssm_parameter" "postgres_host" {
  name = "/${terraform.workspace}/postgres_host"
}

data "aws_ssm_parameter" "postgres_db" {
  name = "/${terraform.workspace}/postgres_db"
}

data "aws_ssm_parameter" "postgres_security_group" {
  name = "/${terraform.workspace}/postgres_security_group"
}

data "aws_ecr_repository" "postgres_django" {
  name = "postgres_django"
}

resource "aws_ecs_task_definition" "api_postgres" {
  family                   = "api_postgres-${terraform.workspace}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = 256
  memory                   = 512
  task_role_arn            = aws_iam_role.ecs_task.arn
  execution_role_arn       = aws_iam_role.ecs_execution_role.arn
  container_definitions = templatefile("templates/ecs_task_def_api_postgres.json.tpl", {
    image                    = "${data.aws_ecr_repository.postgres_django.repository_url}:${var.application_version}",
    postgres_host            = data.aws_ssm_parameter.postgres_host.value,
    postgres_db              = data.aws_ssm_parameter.postgres_db.value,
    postgres_user            = data.aws_ssm_parameter.postgres_user.value,
    postgres_password        = data.aws_ssm_parameter.postgres_password.value,
    cloudwatch_log_group     = aws_cloudwatch_log_group.frontend.name,
    cloudwatch_stream_prefix = "api_postgres",
    postgres_api_url         = var.acm_certificate_domain_api_postgres == "" ? aws_alb.api_postgres.dns_name : var.acm_certificate_domain_api_postgres,
    openid_discovery_url     = var.openid_discovery_url
    django_settings_module   = lookup(local.django_settings_module, terraform.workspace, "carts.settings"),
    endpoint_ui              = local.endpoint_ui,
    uploads_bucket_name      = aws_s3_bucket.uploads.id
  })
}

resource "aws_security_group" "api_postgres" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "api_postgres_ingress" {
  type                     = "ingress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.alb_api_postgres.id
  security_group_id        = aws_security_group.api_postgres.id
}

resource "aws_security_group_rule" "api_postgres_egress" {
  type                     = "egress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = data.aws_ssm_parameter.postgres_security_group.value
  security_group_id        = aws_security_group.api_postgres.id
}

resource "aws_security_group_rule" "postgres_ingress_from_api_postgres" {
  type                     = "ingress"
  from_port                = 5432
  to_port                  = 5432
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_postgres.id
  security_group_id        = data.aws_ssm_parameter.postgres_security_group.value
}

resource "aws_security_group_rule" "api_postgres_egress_ecr_pull" {
  type              = "egress"
  from_port         = 0
  to_port           = 0
  protocol          = "-1"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.api_postgres.id
}

resource "aws_ecs_service" "api_postgres" {
  name            = "api_postgres"
  cluster         = aws_ecs_cluster.frontend.id
  task_definition = aws_ecs_task_definition.api_postgres.arn
  capacity_provider_strategy {
    capacity_provider = "FARGATE"
    weight            = "100"
  }
  desired_count = 1
  network_configuration {
    subnets         = data.aws_subnet_ids.private.ids
    security_groups = [aws_security_group.api_postgres.id]
  }
  load_balancer {
    target_group_arn = aws_alb_target_group.api_postgres.arn
    container_name   = "api_postgres"
    container_port   = 8000
  }
  deployment_minimum_healthy_percent = 100
}

resource "null_resource" "wait_for_ecs_stability_api_postgres" {
  triggers = {
    ecs_task_def_id = aws_ecs_task_definition.api_postgres.id
  }
  provisioner "local-exec" {
    command = "aws ecs wait services-stable --cluster ${aws_ecs_cluster.frontend.name} --services ${aws_ecs_service.api_postgres.name}"
  }
  depends_on = [aws_ecs_service.api_postgres]
}


resource "aws_security_group" "alb_api_postgres" {
  vpc_id = data.aws_vpc.app.id
}

resource "aws_security_group_rule" "alb_api_postgres_egress" {
  type                     = "egress"
  from_port                = 8000
  to_port                  = 8000
  protocol                 = "tcp"
  source_security_group_id = aws_security_group.api_postgres.id
  security_group_id        = aws_security_group.alb_api_postgres.id
}

resource "aws_security_group_rule" "alb_api_postgres_ingress_8000" {
  type              = "ingress"
  from_port         = 8000
  to_port           = 8000
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgres.id
}

resource "aws_security_group_rule" "alb_api_postgres_ingress_443" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  type              = "ingress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = aws_security_group.alb_api_postgres.id
}

resource "aws_alb" "api_postgres" {
  name            = "api-postgres-${terraform.workspace}"
  internal        = false
  security_groups = [aws_security_group.alb_api_postgres.id]
  subnets         = data.aws_subnet_ids.public.ids
}

resource "aws_alb_target_group" "api_postgres" {
  name                 = "api-postgres-tg-${terraform.workspace}"
  port                 = 8000
  target_type          = "ip"
  protocol             = "HTTP"
  deregistration_delay = "1"
  vpc_id               = data.aws_vpc.app.id
  health_check {
    matcher             = "200,403"
    unhealthy_threshold = 10
    interval            = 60
  }
  depends_on = [aws_alb.api_postgres]
}

data "aws_acm_certificate" "api_postgres" {
  count    = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  domain   = var.acm_certificate_domain_api_postgres
  statuses = ["ISSUED"]
}

resource "aws_alb_listener" "https_forward_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "443"
  protocol          = "HTTPS"
  certificate_arn   = data.aws_acm_certificate.api_postgres[0].arn
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_forward_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 1 : 0
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "forward"
  }
}

resource "aws_alb_listener" "http_to_https_redirect_api_postgres" {
  count             = var.acm_certificate_domain_api_postgres == "" ? 0 : 1
  load_balancer_arn = aws_alb.api_postgres.id
  port              = "8000"
  protocol          = "HTTP"
  default_action {
    target_group_arn = aws_alb_target_group.api_postgres.id
    type             = "redirect"
    redirect {
      port        = "443"
      protocol    = "HTTPS"
      status_code = "HTTP_302"
    }
  }
}

resource "aws_wafv2_web_acl" "apiwaf" {
  name        = "apiwaf-${terraform.workspace}"
  description = "WAF for postgres api alb"
  scope       = "REGIONAL"

  default_action {
    block {}
  }

  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "${terraform.workspace}-webacl"
    sampled_requests_enabled   = true
  }

  rule {
    name     = "${terraform.workspace}-api-DDOSRateLimitRule"
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
      metric_name                = "${terraform.workspace}-api-DDOSRateLimitRuleMetric"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-api-RegAWSCommonRule"
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
      metric_name                = "${terraform.workspace}-api-RegAWSCommonRuleMetric"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-api-AWSManagedRulesAmazonIpReputationList"
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
      metric_name                = "${terraform.workspace}-api-RegAWS-AWSManagedRulesAmazonIpReputationList"
      sampled_requests_enabled   = false
    }
  }

  rule {
    name     = "${terraform.workspace}-api-RegAWSManagedRulesKnownBadInputsRuleSet"
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
      metric_name                = "${terraform.workspace}-api-RegAWS-AWSManagedRulesKnownBadInputsRuleSet"
      sampled_requests_enabled   = true
    }
  }

  rule {
    name     = "${terraform.workspace}-api-allow-usa-plus-territories"
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
      metric_name                = "${terraform.workspace}-api-geo-rule"
      sampled_requests_enabled   = true
    }
  }
}

resource "aws_wafv2_web_acl_association" "apipostgreswafalb" {
  resource_arn = aws_alb.api_postgres.id
  web_acl_arn  = aws_wafv2_web_acl.apiwaf.arn
}

# # ============== Import Data ====================
data "aws_caller_identity" "current" {}

locals {
  account_id = data.aws_caller_identity.current.account_id
}

// data "aws_s3_bucket" "webacl_s3" {
//   bucket = "${var.s3_bucket}"
// }

# Need to update with Prod and Val Bucket name
locals { waf_logging_bucket = { prod: "cms-cloud-730373213083-us-east-1-legacy", val: "cms-cloud-730373213083-us-east-1-legacy", master: "cms-cloud-730373213083-us-east-1-legacy" } }

data "aws_s3_bucket" "webacl_s3" {
  bucket = "${lookup(local.waf_logging_bucket, terraform.workspace, local.waf_logging_bucket["master"])}"
}

// ##Create S3 Sub-folder
resource "aws_s3_bucket_object" "waf_bucket_folder" {
    bucket = "${data.aws_s3_bucket.webacl_s3.id}"
    acl    = "private"
    ##key= "/Prefix/Sub-folder/"
    key    = "CloudTrail/${terraform.workspace}/"
    
}
# # ========================Create Kinesis firehose and role ========================
resource "aws_kinesis_firehose_delivery_stream" "stream" {
  count = "${var.enable_log_waf_acl == true ? 1 : 0}"
  name        = "aws-waf-logs-${terraform.workspace}"
  destination = "extended_s3"

  extended_s3_configuration {
    role_arn   = aws_iam_role.firehose_role.arn
    bucket_arn = data.aws_s3_bucket.webacl_s3.arn
    prefix ="CloudTrail/${terraform.workspace}/"
  }
}

resource "aws_iam_role" "firehose_role" {
  name = "KinesisFirehoseRole-aws-${terraform.workspace}"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "firehose.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "firehose_policy" {
  depends_on  = [aws_kinesis_firehose_delivery_stream.stream]
  name = "KinesisFirehosePolicy-aws-${terraform.workspace}"
  role = aws_iam_role.firehose_role.id

  policy = <<-EOF
  {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
          "s3:AbortMultipartUpload",
          "s3:GetBucketLocation",
          "s3:GetObject",
          "s3:ListBucket",
          "s3:ListBucketMultipartUploads",
          "s3:PutObject"
          ],
        "Resource": [
          "${data.aws_s3_bucket.webacl_s3.arn}",
          "${data.aws_s3_bucket.webacl_s3.arn}/*"
        ]
      },
      {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
          "lambda:InvokeFunction",
          "lambda:GetFunctionConfiguration"
        ],
        "Resource": [
          "arn:aws:lambda:${var.region}:${local.account_id}:function:*"
        ]
      },
      {
        "Sid": "",
        "Effect": "Allow",
        "Action": [
          "logs:PutLogEvents"
        ],
        "Resource": [
          "arn:aws:logs:${var.region}:${local.account_id}:log-group:/aws/kinesisfirehose/aws-${terraform.workspace}:log-stream:*"
        ]
      }
    ]
  }
  EOF
}

# =================== Enable WAF Logging ===================
resource "aws_wafv2_web_acl_logging_configuration" "log" {
  count = "${var.enable_log_waf_acl == true ? 1 : 0}"
  log_destination_configs = [ aws_kinesis_firehose_delivery_stream.stream[count.index].arn ]
  resource_arn            = aws_wafv2_web_acl.apiwaf.arn
}