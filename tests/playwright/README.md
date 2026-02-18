# Playwright Testing

[Playwright](https://playwright.dev/) is an open source testing tool maintained by Microsoft.

## Configuration

`playwright.config.ts` may use any of [these](https://playwright.dev/docs/test-configuration) config options.

## Setup and run tests locally

To run playwright tests locally you will go to the root of the project and you'll need an updated .env with variables for the state user and admin user passwords. To accomplish this there are multiple options.

### One time setup

1. If you have a 1Password account and 1Password CLI installed locally you can run
   `./run update-env` to pull values from 1Password and create an updated .env

2. Alternatively, if you do not have a 1Password account you can copy the contents of the `.env.tpl` file to a `.env` file at the top level of the repo and reach out to the team for appropriate values to be populated by hand.

3. Install playwright tests browsers `cd tests/ && yarn playwright install`

### Run tests

There are four options for running tests locally. You can execute these commands from project root or from the `tests/` folder.

1. `yarn test:e2e`

- Starts the app locally and runs all tests in terminal. Terminates when tests complete.

2. `yarn test:e2e-ui`

- Starts the app locally
- Launches Playwright UI
- Runs all the tests

3. `yarn test:e2e-stable`

- Starts the app locally and runs tests in the terminal without the @flaky or @probation tags

4. `yarn test:e2e-stable-ui`

- Starts the app locally
- Launches Playwright UI
- Runs tests without the @flaky or @probation tags

## Troubleshooting

If you run into errors after trying to run the playwright test command:

- run `yarn` in this folder
- run `nvm use` in the root directory

If you don't see any tests listed in the UI:

- open the "Filter" dropdown in the upper left of the playwright UI
- deselect all options, or ensure the selections match what you want
