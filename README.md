# MDCT CARTS (CHIP Annual Reporting Template System)

[![CodeQL](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/codeql-analysis.yml)
[![Maintainability](https://qlty.sh/badges/56366865-e4c7-43ff-9ee9-5a44fd29b0f2/maintainability.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-carts)
[![Code Coverage](https://qlty.sh/badges/56366865-e4c7-43ff-9ee9-5a44fd29b0f2/test_coverage.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-carts)

## Integration Environment Deploy Status:
| Branch  | Build Status |
| ------------- | ------------- |
| main  | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg)  |
| val  | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg?branch=val)  |
| production  | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg?branch=production)  |


CARTS is the CMCS MDCT application for collecting state data related to coverage of CHIP state plans on an annual basis. The collected data assists CMCS in monitoring, managing, and better understanding Medicaid and CHIP programs.

Under section 2108(a) of the Act, states must assess the operation of their separate CHIP and Medicaid expansion programs and the progress made in reducing the number of uncovered, low-income children. The results of the assessment are reported to the Secretary by January 1 following the end of the FY in the CHIP Annual Reporting Template System (CARTS). CARTS collects information about programmatic changes, performance goals, program operation, program financing, program challenges and accomplishments.

_Note: The [`main`](https://github.com/Enterprise-CMCS/macpro-mdct-carts/tree/main) branch contains CARTSv3. All code related to CARTSv2 (legacy) can be found in the [`skipci-archive-carts-v2`](https://github.com/Enterprise-CMCS/macpro-mdct-carts/tree/skipci-archive-carts-v2) branch._

## Table of contents

- [Status](#status)
- [Quick Start](#quick-start)
- [Contributing](#contributing)
- [Architecture] (#architecture)
- [Copyright and license](#copyright-and-license)

## Quick Start

### Running MDCT Workspace Setup
Team members are encouraged to setup all MDCT Products using the script located in the [MDCT Tools Repository](https://github.com/Enterprise-CMCS/macpro-mdct-tools). Please refer to the README for instructions running the MDCT Workspace Setup. After Running workspace setup team members can refer to the Running the project locally section below to proceed with running the application. 

### One time only ( this is not needed if you've run the MDCT Workspace setup)

Before starting the project install some tools

- `brew install nvm`
- `brew install pre-commit`
- `pre-commit install`

### Running the project locally

1. Ensure you either have a 1Password account and have 1Password CLI installed. Alternatively, reach out to the team for an example of .env files
2. In the root of the project run `./run local --update-env` or if you do not have a 1Password account you can simply run `./run local` to use a static .env file
   note: the `./run local --update-env` pulls secret values using the 1Password CLI and populates a local .env file that is gitignored.

### Logging in

For local development there is a list of users that can be found at services/ui-auth/libs/users.json.

### DynamoDB locally

In order to run dynamodb locally you will need to have java installed on your system. If not currently installed go here: https://java.com/en/download/ to download the latest version.

If you want to a visual view of your dynamodb after the application is up and running you can install the dynamodb-admin tool from here: https://www.npmjs.com/package/dynamodb-admin

- to run the dynamodb gui, run `DYNAMO_ENDPOINT=http://localhost:8000 dynamodb-admin` in a new terminal window

### Seed Data

There are two mechanisms for seeding data.

- Locally, seed data is controlled by the `database/serverless.yaml` seed section. Note the data is pulled from both the /seed and /seed-local folders.
  - The seed and seed-local folders are just seperated for convention and clarity, they have no special behavior
  - This relies on a serveless plugin for dynamo that does not work in deployed envs.
- Seeding deployed environments is controlled with the seed lambda in the database service, and can be added to with the `handlers/seed/tables/index`, and pulling in data from the `data/seed` folder.
  - This is useful for deploying data such as section base templates, and keeping it up to date with the code base.
  - Adding specific test seed data to environments may be useful for things like cypress tests. This can be accomplished with the test-tables directory, referencing the same seed-local tables if desired.

### Local Development Random Info

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/run.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

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

## Adding a new Yearly Form

Refer to [this walkthrough](services/database/YEARLY_UPDATE.md) for steps to take when adding a new annual form.

## SEDS Data

SEDS CHIP Data regarding enrollment counts is populated into Section 2 Part 1.

This is accomplished by the setup in the `services/carts-bigmac-streams/handlers/sinkEnrollmentCounts.js` service, which sets up a listener on the topic `aws.mdct.seds.cdc.state-forms.v0`.

When a message is kicked off, the process sorts the update into updates for the prior year or current year, and fills out an enrollments table based on that info.

In the UI, when a user is filling out the form, those numbers are loaded into the table and require a user saving the submission to update the CARTS section.

On the SEDS side, this topic is updated on every submission of seds data, but CARTS filters based the following:

- current and prior year
- 4th quarter data.
- The rollover for a "new year" is October, and future submissions are not recognized until that threshold

Updates outside of that time frame will need to be manually corrected in CARTS, or the integration will need to be modifed to collect data for old forms. CARTS additionally looks for the `enrollmentCounts` property which is only included in forms 21E and 64.21E (question 7), either by manual trigger or update.

For testing convenience, stateuser2 points at AL in CARTS and the stateuser points at AL in SEDS.

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

Cypress `a11y` tests use [cypress-axe](https://github.com/component-driven/cypress-axe), [@cypress-audit/pa11y](https://mfrachet.github.io/cypress-audit/guides/pa11y/installation.html).

### Prettier Linter

We use Prettier to format all code. This runs as part of a Git Hook and changes to files will cause the deploy to fail. If you followed the instructions above this is already installed and configured.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or invoking Prettier on the command line.

## Slack Webhooks

This repository uses 3 webhooks to publish to  3 different channels all in CMS Slack.

- SLACK_WEBHOOK: This pubishes to the `macpro-mdct-carts-alerts` channel. Alerts published there are for deploy or test failures to the `main`, `val`, or `production` branches.

- INTEGRATIONS_SLACK_WEBHOOK: This is used to publish new pull requests to the `mdct-integrations-channel`

- PROD_RELEASE_SLACK_WEBHOOK: This is used to publish to the `mdct-prod-releases` channel upon successful release of CARTS to production.

    - Webhooks are created by CMS tickets, populated into GitHub Secrets

## GitHub Actions Secret Management
- Secrets are added to GitHub secrets by GitHub Admins 
- Development secrets are maintained in a 1Password vault

## Architecture

TODO: Get an updated diagram
![Architecture Diagram](./.images/architecture.svg?raw=true)
