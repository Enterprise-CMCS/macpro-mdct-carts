# Import Instructions

## From `pete-sls` branch

Command-Shift-H (Replace in Files) <YOUR_BRANCH_NAME>

```sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT all of .env file except SERVERLESS_LICENSE_KEY
# COMMENT OUT all of services/ui-src/.env file
export AWS_DEFAULT_REGION=us-east-1
./run deploy --stage <YOUR_BRANCH_NAME>

./run destroy --stage <YOUR_BRANCH_NAME>

# Record the output from the destroy command for the subsequent import

```

delete the bucket policy from ui-<stage>-cloudfront-logs-<account>

## From `jon-cdk` branch

Command-Shift-H (Replace in Files) <YOUR_BRANCH_NAME>

```sh
rm -rf node_modules
yarn install
./run deploy-prerequisites
IMPORT_VARIANT=empty ./run deploy --stage <YOUR_BRANCH_NAME>
IMPORT_VARIANT=imports_included PROJECT=carts yarn cdk import --context stage=<YOUR_BRANCH_NAME> --force
IMPORT_VARIANT=imports_included ./run deploy --stage <YOUR_BRANCH_NAME>
./run deploy --stage <YOUR_BRANCH_NAME>
```

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
