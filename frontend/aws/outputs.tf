
output "application_endpoint" {
  value = local.endpoint_ui
}

output "api_postgres_endpoint" {
  value = local.endpoint_api_postgres
}


output "s3_bucket_name" {
  value = aws_s3_bucket.www.id
}

output "cloudfront_distribution_id" {
  value = "${aws_cloudfront_distribution.www_distribution.id}"
}

output "s3_uploads_bucket_name" {
  value = aws_s3_bucket.uploads.id
}
