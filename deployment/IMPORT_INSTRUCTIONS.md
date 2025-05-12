# Import Instructions

## From `pete-sls` branch

```sh
rm -rf node_modules
yarn install
./run update-env
# COMMENT OUT all of .env file except SERVERLESS_LICENSE_KEY
# COMMENT OUT all of services/ui-src/.env file
./run deploy --stage <YOUR_BRANCH_NAME>

# CloudfrontLogBucket.BucketName -
# cloudfront.Distribution -
# cognito.UserPool -
# BucketEncryptionKMSKey.KeyId -
# AttachmentsBucket.BucketName -
# DynamoSnapshotBucket.BucketName -

# manually dissassociate web acl in app-api-<YOUR_BRANCH_NAME>
./run destroy --stage <YOUR_BRANCH_NAME>

```

## From `jon-cdk` branch

```sh
rm -rf node_modules
yarn install
./run update-env
./run deploy-prerequisites
IMPORT_VARIANT=empty ./run deploy --stage <YOUR_BRANCH_NAME>
IMPORT_VARIANT=imports_included PROJECT=qmr yarn cdk import --context stage=<YOUR_BRANCH_NAME> --force
IMPORT_VARIANT=imports_included ./run deploy --stage <YOUR_BRANCH_NAME>
./run deploy --stage <YOUR_BRANCH_NAME>
```

Once final deploy is done, KMS key should have correct policy with an old lingering policy statement that can be removed. It is the one that has exactly 3 principals listed.

Log into app using all options (Cognito and/or IDM) and follow instructions that app lead has provided to ensure app is working.
:tada: Congrats, you did it!
