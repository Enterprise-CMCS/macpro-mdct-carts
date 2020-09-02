variable source_database_password {}
variable target_database_password {}

module "dms_master" {
  source                   = "../../modules/dms"
  team_name                = "MACPRO"
  business-unit            = "DevOps"
  application              = "carts"
  environment-name         = "staging"
  source_database_name     = "SCHIPAnnualReports"
  source_database_username = "mbescbes"
  source_database_password = "${var.source_database_password}"
  source_database_host     = "source_database_host"
  source_database_port     = "source_database_port"
  target_database_name     = "postgres"
  target_database_username = "pguser"
  target_database_password = "${var.target_database_password}"
  target_database_host     = "target_database_host"
  subnet_ids               = ["subnet_ids"]
  vpc_id                   = "vpc_id"
}
