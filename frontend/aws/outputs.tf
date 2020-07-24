
output "application_endpoint" {
  value = "http://${aws_alb.ui.dns_name}"
}

output "api_postgres_endpoint" {
  value = "http://${aws_alb.api_postgres.dns_name}:${aws_alb_listener.http_forward_api_postgres.port}"
}
