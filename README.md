# CHIP Annual Reporting Template System

Under section 2108(a) of the Act, states must assess the operation of their separate CHIP and Medicaid expansion programs and the progress made in reducing the number of uncovered, low-income children. The results of the assessment are reported to the Secretary by January 1 following the end of the FY in the CHIP Annual Reporting Template System (CARTS). CARTS collects information about programmatic changes, performance goals, program operation, program financing, program challenges and accomplishments.

_Our main branch is for development of CARTSv3. Head to the [`master` branch](https://github.com/cmsgov/cms-carts-seds/tree/master) to view the readme, documentation, and source code fo CARTSv2._

[![Maintainability](https://api.codeclimate.com/v1/badges/6bd409a85fe7b9b7d1ff/maintainability)](https://codeclimate.com/github/CMSgov/cms-carts-seds/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/6bd409a85fe7b9b7d1ff/test_coverage)](https://codeclimate.com/github/CMSgov/cms-carts-seds/test_coverage)

## Table of contents

- [Status](#status)
- [Quick Start](#quick-start)
- [Contributing](#contributing)
- [Architecture] (#architecture)
- [Copyright and license](#copyright-and-license)

## Status

TODO: Add all the status badges here

## Quick Start

### One time only

Before starting the project install some tools

- `brew install nvm`
- `brew install pre-commit`

### Setting up the project locally

TODO: Fix the phone a friend instructions below

1. Clone the repo: `git clone https://github.com/CMSgov/cms-carts-seds.git`
2. In the root directory copy the .env_example file and name it .env
3. In the services/ui-src directory copy the .env_example file and name it .env
4. Overwrite the values here with an example from another developer
5. In the root directory run `pre-commit install`
6. Also in the root of the project run `./dev local`

### Logging in

For local development there is a list of users that can be found at services/ui-auth/libs/users.json.

### DynamoDB locally

In order to run dynamodb locally you will need to have java installed on your system. If not currently installed go here: https://java.com/en/download/ to download the latest version.

If you want to a visual view of your dynamodb after the application is up and running you can install the dynamodb-admin tool from here: https://www.npmjs.com/package/dynamodb-admin

- to run the dynamodb gui, run `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin` in a new terminal window

### Local Development Random Info

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/dev.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

Local dev is built around the Serverless plugin [`serverless-offline`](https://github.com/dherault/serverless-offline). `serverless-offline` runs an API gateway locally configured by `./services/app-api/serverless.yml` and hot reloads your lambdas on every save. The plugins [`serverless-dynamodb-local`](https://github.com/99x/serverless-dynamodb-local) and [`serverless-s3-local`](https://github.com/ar90n/serverless-s3-local) stand up the local db and local s3 in a similar fashion.

When run locally, auth bypasses Cognito. The frontend mimics login in local storage with a mock user and sends an id in the `cognito-identity-id` header on every request. `serverless-offline` expects that and sets it as the cognitoId in the requestContext for your lambdas, just like Cognito would in AWS.

It should be noted that while logged in as a state user, the download template button will not actually trigger a download of a fiscal year template in localhost, it will instead look at the main branches s3 bucket for the fiscal year template. The way the download is setup is that it is looking for an s3 bucket in main, val, or prod. Localhosting of the file is not supported. If you want to support localhost for testing purposes, you can do the following steps:

- Update the services/uploads/serverless.yml file's FiscalYearCreateBucketCondition to be so:

```
    !YourNewConditionHere!: !Equals
      - !AddYourBranchNameHere!
      - ${self:custom.stage}
    FiscalYearCreateBucketCondition: !Or
      - !Condition !YourNewConditionHere!
      - !Condition IsMainCondition
      - !Condition IsValCondition
      - !Condition IsProdCondition
```

- Git add/commit/push the branch with the above change to git.
- After the deploy action runs on branch being pushed, you should see the bucket now lives in s3 with a name that resembles uploads-AddYourBranchNameHere!-carts-download
- You'll then want to actually upload the document you want to see! Currently, the key is set to look for a file called "FFY_2021_CARTS_Template.pdf", but you can swap that out in the services/app-api/handlers/fiscalYearTemplate/get.ts file.

## Copyright and license

[![License](https://img.shields.io/badge/License-CC0--1.0--Universal-blue.svg)](https://creativecommons.org/publicdomain/zero/1.0/legalcode)

```text
As a work of the United States Government, this project is
in the public domain within the United States.

Additionally, we waive copyright and related rights in the
work worldwide through the CC0 1.0 Universal public domain dedication.
```

## Contributing

Our product has three deployed environments.

- Dev (main branch)
- Val / Impl ()
- Production ()

TODO: writeup the CI/CD flow for the application

### Testing

#### Frontend Unit Tests

Frontend unit testing is being done using [Jest](https://jestjs.io/).

Jest unit test files should be in the same directory as their corresponding component and follow the `Component.test.js` naming convention.

```
cd services/ui-src/
yarn test

# live reload all tests
yarn test --watch

# specify test to run
npx jest src/components --watch  # run all component tests and watch for changes
```

#### E2E Cypress Tests

[See here](./tests/cypress/README.md)

#### Accessibility Tests

Frontend accessibility (a11y) unit tests are being done using Jest with [axe-core](https://github.com/dequelabs/axe-core) and [jest-axe](https://github.com/nickcolley/jest-axe). To test a component's accessibility, import `axe` from `jest-axe` and pass the rendered component to `axe()`, then check for a11y issues using `toHaveNoViolations()`.

To test the accessibility of an endpoint, [pa11y](https://github.com/pa11y/pa11y) is being used in combination with [aXe](https://www.axe-core.org/) and [HTML CodeSniffer](https://squizlabs.github.io/HTML_CodeSniffer/) as test runners.

```
cd services/ui-src/
yarn pa11y <url-endpoint>
```

Cypress `a11y` tests use [cypress-axe](https://github.com/component-driven/cypress-axe), [@cypress-audit/pa11y](https://mfrachet.github.io/cypress-audit/guides/pa11y/installation.html), and [@cypress-audit/lighthouse](https://mfrachet.github.io/cypress-audit/guides/lighthouse/installation.html).

### Prettier Linter

We use Prettier to format all code. This runs as part of a Git Hook and changes to files will cause the deploy to fail. If you followed the instructions above this is already installed and configured.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or invoking Prettier on the command line.

## Architecture

TODO: Get an updated diagram
![Architecture Diagram](./.images/architecture.svg?raw=true)
