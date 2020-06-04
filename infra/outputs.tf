
output "application_endpoint" {
  value = "http://${aws_alb.ui.dns_name}"
}

output "api_endpoint" {
  value = "http://${aws_alb.api.dns_name}:${aws_alb_listener.http_forward_api.port}"
}
