variable source_database_password {}
variable target_database_password {}

module "dms_master" {
  source                   = "../../modules/dms"
  team_name                = "MACPRO"
  business-unit            = "DevOps"
  application              = "carts"
  environment-name         = "master"
  source_database_name     = "SCHIPAnnualReports"
  source_database_username = "mbescbes"
  source_database_password = "${var.source_database_password}"
  source_database_host     = "192.168.154.56"
  source_database_port     = "1515"
  target_database_name     = "postgres"
  target_database_username = "pguser"
  target_database_password = "${var.target_database_password}"
  target_database_host     = "postgres-rf-master.ccjaiigdw7dc.us-east-1.rds.amazonaws.com"
  subnet_ids               = ["subnet-0cf8cc26","subnet-4db58215","subnet-2fc12566"]
  vpc_id                   = "vpc-3f3daa58"
}
