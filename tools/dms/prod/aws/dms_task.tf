variable source_database_password {}
variable source_database_host {}
variable target_database_password {}

module "dms_prod" {
  source                   = "../../modules/dms"
  team_name                = "MACPRO"
  business-unit            = "DevOps"
  application              = "cartsseds"
  environment-name         = "prod"
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
  target_database_host     = "postgres-rf-prod.ccjaiigdw7dc.us-east-1.rds.amazonaws.com"
  subnet_ids               = ["subnet-477fea1c", "subnet-f1bb28dc", "subnet-725e1c3b"]
  vpc_id                   = "vpc-9030e2f6"
  security_group_ids       = ["sg-4652713b", "sg-03de777f"]
}
