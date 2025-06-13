# MDCT CARTS (CHIP Annual Reporting Template System)

[![CodeQL](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/codeql-analysis.yml/badge.svg?branch=main)](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/codeql-analysis.yml)
[![Maintainability](https://qlty.sh/badges/56366865-e4c7-43ff-9ee9-5a44fd29b0f2/maintainability.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-carts)
[![Code Coverage](https://qlty.sh/badges/56366865-e4c7-43ff-9ee9-5a44fd29b0f2/test_coverage.svg)](https://qlty.sh/gh/Enterprise-CMCS/projects/macpro-mdct-carts)

## Integration Environment Deploy Status:

| Branch     | Build Status                                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------------------------------ |
| main       | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg)                   |
| val        | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg?branch=val)        |
| production | ![deploy](https://github.com/Enterprise-CMCS/macpro-mdct-carts/actions/workflows/deploy.yml/badge.svg?branch=production) |

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

Dynamo is run locally by localstack.

### Seed Data

There are two mechanisms for seeding data.

- Seed data is controlled by the `deployment/stacks/data.ts` seed section. Note the data is pulled from both the /seed (regardless of branch) and /seed-local (only on ephemeral branches) folders.
  - The seed and seed-local folders are just seperated for convention and clarity, they have no special behavior
- Seeding is done by the seed lambda in the database service, and can be added to with the `handlers/seed/tables/index`, and pulling in data from the `data/seed` folder.
  - This is useful for deploying data such as section base templates, and keeping it up to date with the code base.
  - Adding specific test seed data to environments may be useful for things like cypress tests. This can be accomplished with the test-tables directory, referencing the same seed-local tables if desired.

### Local Development Random Info

Local dev is configured in typescript project in `./src`. The entrypoint is `./src/run.ts`, it manages running the moving pieces locally: the API, the database, the filestore, and the frontend.

It should be noted that while logged in as a state user, the download template button will not actually trigger a download of a fiscal year template in localhost, it will instead look at the main branches s3 bucket for the fiscal year template. The way the download is setup is that it is looking for an s3 bucket in main, val, or prod. Localhosting of the file is not supported.

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

Cypress `a11y` tests use [cypress-axe](https://github.com/component-driven/cypress-axe)

### Prettier Linter

We use Prettier to format all code. This runs as part of a Git Hook and changes to files will cause the deploy to fail. If you followed the instructions above this is already installed and configured.

Most IDEs have a Prettier plugin that can be configured to run on file save. You can also run the format check manually from the IDE or invoking Prettier on the command line.

## Slack Webhooks

This repository uses 3 webhooks to publish to 3 different channels all in CMS Slack.

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

## CDK

This project is built as a series of micro-services using the [CDK](https://aws.amazon.com/cdk/). CDK allows you to write typescript that compiles into CloudFormation Templates.

### Configuration AWS Secrets Manager

---

Look in `deployment/deployment-config.ts` and look at the `DeploymentConfigProperties` interface which should give you a sense of which values are being injected into the app. The values must either be in `carts-default` secret or `carts-STAGE` to be picked up. The secrets are json objects so they contain multiple values each.

No values should be specified in both secrets. Just don't do it. Ok if that did ever happen the stage value would supercede. But really I promise you don't need it.
