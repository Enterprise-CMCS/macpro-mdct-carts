variable source_database_password {}
variable source_database_host {}
variable target_database_password {}

module "dms_staging" {
  source                   = "../../modules/dms"
  team_name                = "MACPRO"
  business-unit            = "DevOps"
  application              = "cartsseds"
  environment-name         = "staging"
  source_database_name_carts  = "SCHIPAnnualReports"
  source_database_name_seds  = "SCHIP"
  source_database_name_mbescbes = "MBESCBES"
  source_database_username = "mbescbes"
  source_database_password = "${var.source_database_password}"
  source_database_host     = "${var.source_database_host}"
  source_database_port     = "1515"
  target_database_name     = "postgres"
  target_database_username = "pguser"
  target_database_password = "${var.target_database_password}"
  target_database_host     = "postgres-rf-staging.ccjaiigdw7dc.us-east-1.rds.amazonaws.com"
  subnet_ids               = ["subnet-4a4e6212", "subnet-b14f6d9b", "subnet-8aa4b7fc"]
  vpc_id                   = "vpc-76ef6c11"
  security_group_ids       = ["sg-62052519", "sg-4391623f"]
}
