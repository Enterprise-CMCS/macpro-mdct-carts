# database

## scripts

The [scripts/](./scripts/) folder is for small text and data fixes. Write and test new scripts locally and with ephemeral branches. After merging, run new scripts against the AWS main, val, and production instances (preferably with a second developer for checks along the way).

Any utilities shareable across scripts can be added to the [scripts/utils/](./scripts/utils/) folder. Please use AWS SDK V3, or application latest.

### Running against a local instance:

- In one terminal tab start CARTS locally
- In a new terminal tab, from CARTS root, run:
  `DYNAMODB_URL="http://localhost:8000" dynamoPrefix="local" node services/database/scripts/{script_name}.js`

### Running against a deployed instance:

- Get AWS credentials from the CARTS AWS account in your terminal (carts-dev for all ephemeral branches and main)
- From CARTS root, run:
  `dynamoPrefix="{YOUR BRANCH NAME}" node services/database/scripts/{script_name}.js`
