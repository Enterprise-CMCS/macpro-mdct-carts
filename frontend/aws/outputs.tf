
output "application_endpoint" {
  value = "https://${aws_cloudfront_distribution.www_distribution.domain_name}"
}

output "api_postgres_endpoint" {
  value = local.endpoint_api_postgres
}

output "api_sqlserver_endpoint" {
  value = local.endpoint_api_sqlserver
}

output "s3_bucket_name" {
  value = aws_s3_bucket.www.id
}
