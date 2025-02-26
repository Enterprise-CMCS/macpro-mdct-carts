SKIP_PREFLIGHT_CHECK=true
LOCAL_LOGIN=true
attachmentsBucketName=op://mdct_devs/carts_secrets/attachmentsBucketName
fiscalYearTemplateBucketName=op://mdct_devs/carts_secrets/fiscalYearTemplateBucketName
loggingBucket=op://mdct_devs/carts_secrets/loggingBucket
acsTableName=local-acs
fmapTableName=local-fmap
uploadsTableName=local-uploads
stateTableName=local-state
stateStatusTableName=local-state-status
sectionBaseTableName=local-section-base
sectionTableName=local-section
stageEnrollmentCountsTableName=local-stg-enrollment-counts
DYNAMODB_URL=http://localhost:8000
COGNITO_USER_POOL_ID=op://mdct_devs/carts_secrets/COGNITO_USER_POOL_ID
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/carts_secrets/COGNITO_USER_POOL_CLIENT_ID
POST_SIGNOUT_REDIRECT=op://mdct_devs/carts_secrets/POST_SIGNOUT_REDIRECT
API_URL=http://localhost:3030/local
S3_LOCAL_ENDPOINT=http://localhost:4569
S3_ATTACHMENTS_BUCKET_NAME=op://mdct_devs/carts_secrets/S3_ATTACHMENTS_BUCKET_NAME
docraptorApiKey=op://mdct_devs/carts_secrets/docraptorApiKey # pragma: allowlist secret
iamPath=/
iamPermissionsBoundary="bound"
SLS_INTERACTIVE_SETUP_ENABLE=1

# needed for e2e tests
CYPRESS_ADMIN_USER_EMAIL=op://mdct_devs/carts_secrets/msssqm4kzbmrwhihjtgwozcv5u
CYPRESS_ADMIN_USER_PASSWORD=op://mdct_devs/carts_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
CYPRESS_STATE_USER_EMAIL=op://mdct_devs/carts_secrets/sn6trfrct3cl5sac3pkh2zcjp4
CYPRESS_STATE_USER_PASSWORD=op://mdct_devs/carts_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret

SERVERLESS_LICENSE_KEY=op://mdct_devs/carts_secrets/SERVERLESS_LICENSE_KEY

LOGGING_BUCKET=dummy
