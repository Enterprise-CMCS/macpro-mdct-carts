
output "inspec_postgres_rds_cluster" {
  value = aws_ecs_cluster.saf.name
}

output "inspec_postgres_rds_task_definition_arn" {
  value = aws_ecs_task_definition.inspec_postgres_rds.arn
}

output "inspec_postgres_rds_subnets" {
  value = join(", ", tolist(data.aws_subnet_ids.private.ids))
}

output "inspec_postgres_rds_security_group" {
  value = aws_security_group.inspec_postgres_rds.id
}
