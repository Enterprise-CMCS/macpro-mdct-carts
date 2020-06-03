
output "application_endpoint" {
  value = "http://${aws_alb.alb.dns_name}"
}
