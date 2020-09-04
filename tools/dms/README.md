Drawn from https://github.com/ministryofjustice/cloud-platform-terraform-dms

The DMS code is intended to be run locally rather than managed through a CI tool. To run, navigate to your target environment within the DMS folder (e.g. tools/dms/prod). From this directory, execute the following:

# Secret Values
* Copy terraform.tfvars.example into a new file called terraform.tfvars, in the same directory. 
* Update the password string values for the target and source database connection.

# Terraform Commands
terraform init

terraform workspace new <workspace_name>
terraform workspace select <workspace_name>

terraform plan
terraform apply

# Workspace Names
master
staging
prod