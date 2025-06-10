LOCAL_LOGIN=true
COGNITO_USER_POOL_ID=op://mdct_devs/carts_secrets/COGNITO_USER_POOL_ID
COGNITO_USER_POOL_CLIENT_ID=op://mdct_devs/carts_secrets/COGNITO_USER_POOL_CLIENT_ID
COGNITO_USER_POOL_CLIENT_DOMAIN=op://mdct_devs/carts_secrets/COGNITO_USER_POOL_CLIENT_DOMAIN
COGNITO_IDENTITY_POOL_ID=op://mdct_devs/carts_secrets/COGNITO_IDENTITY_POOL_ID
POST_SIGNOUT_REDIRECT=op://mdct_devs/carts_secrets/POST_SIGNOUT_REDIRECT
REACT_APP_LD_SDK_CLIENT=op://mdct_devs/carts_secrets/REACT_APP_LD_SDK_CLIENT
docraptorApiKey=op://mdct_devs/carts_secrets/docraptorApiKey # pragma: allowlist secret
S3_ATTACHMENTS_BUCKET_NAME=op://mdct_devs/carts_secrets/S3_ATTACHMENTS_BUCKET_NAME

# Used by scripts
dynamoPrefix="localstack"
DYNAMODB_URL="http://localhost:4566"

# needed for e2e tests
CYPRESS_ADMIN_USER_EMAIL=op://mdct_devs/carts_secrets/msssqm4kzbmrwhihjtgwozcv5u
CYPRESS_ADMIN_USER_PASSWORD=op://mdct_devs/carts_secrets/CYPRESS_ADMIN_USER_PASSWORD # pragma: allowlist secret
CYPRESS_STATE_USER_EMAIL=op://mdct_devs/carts_secrets/sn6trfrct3cl5sac3pkh2zcjp4
CYPRESS_STATE_USER_PASSWORD=op://mdct_devs/carts_secrets/CYPRESS_STATE_USER_PASSWORD # pragma: allowlist secret
