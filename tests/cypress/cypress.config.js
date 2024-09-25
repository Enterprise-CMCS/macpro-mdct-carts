const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");
const { lighthouse } = require("@cypress-audit/lighthouse");
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");
require("dotenv").config({ path: "../../.env" });

module.exports = defineConfig({
  redirectionLimit: 20,
  retries: 2,
  watchForFileChanges: true,
  fixturesFolder: "fixtures",
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  types: ["cypress", "cypress-axe"],
  env: {
    STATE_USER_EMAIL: process.env.CYPRESS_STATE_USER_EMAIL,
    // pragma: allowlist nextline secret
    STATE_USER_PASSWORD: process.env.CYPRESS_STATE_USER_PASSWORD,
    ADMIN_USER_EMAIL: process.env.CYPRESS_ADMIN_USER_EMAIL,
    // pragma: allowlist nextline secret
    ADMIN_USER_PASSWORD: process.env.CYPRESS_ADMIN_USER_PASSWORD,
  },
  e2e: {
    baseUrl: "http://localhost:3000/",
    testIsolation: false,
    specPattern: "**/*.spec.js",
    supportFile: "support/index.js",
    excludeSpecPattern: "**/filterReports.spec.js",
    async setupNodeEvents(on, config) {
      await preprocessor.addCucumberPreprocessorPlugin(on, config);
      on("file:preprocessor", browserify.default(config));
      on("before:browser:launch", (_browser = {}, launchOptions) => {
        prepareAudit(launchOptions);
      });
      on("task", {
        log(message) {
          // eslint-disable-next-line no-console
          console.log(message);

          return null;
        },
        table(message) {
          // eslint-disable-next-line no-console
          console.table(message);

          return null;
        },
        pa11y: pa11y(),
        lighthouse: lighthouse(),
      });

      return config;
    },
  },
});
