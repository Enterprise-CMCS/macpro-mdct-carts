# Terraform

Drawn from https://github.com/ministryofjustice/cloud-platform-terraform-dms

The DMS code is intended to be run locally rather than managed through a CI tool. To run, navigate to your target environment within the DMS folder (e.g. tools/dms/prod). From this directory, execute the following:

## Secret Values

- Copy terraform.tfvars.example into a new file called terraform.tfvars, in the same directory.
- Update the password string values for the target and source database connection.

## Terraform Commands

_To be run from /tools/dms/<workspace_name>/aws_
terraform init

terraform workspace new <workspace_name>
terraform workspace select <workspace_name>
terraform workspace list - will show all available workspaces and which is currently selected

terraform plan
terraform apply

# Automated nightly job

_To be run from tools/dms/serverless_
Serverless architecture adapted from https://serverless-stack.com/

- To run locally: npm install, serverless invoke local --function #{Function Name} --stage #{Stage Name}
- To destroy: serverless remove
- To deploy to AWS: serverless deploy --stage #{Stage Name}

## Email notifications

Email recipients for error notifications must be configured through the AWS SNS console:

- Navigate to the AWS console
- Navigate to the SNS dashboard: https://console.aws.amazon.com/sns/v3/home?region=us-east-1#/dashboard
- Select "Topics" from the left-hand navigational menu
- Select the Topic for the environment you wish to configure (e.g. topic-cartsseds-master-seds)
- Click "Create subscription"
- In the "Protocol" dropdown, select "Email"
- Provide the email address to receive notifications and click "Create subscription"
- Once the Subscription to this Topic is created, you will need to navigate to the email address inbox. You will have received a confirmation email from AWS. Clicking the link in the email will validate the email address and begin receiving notifications.

# Workspace/Stage Names

- master
- staging
- prod
