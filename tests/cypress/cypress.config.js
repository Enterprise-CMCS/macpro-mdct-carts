const { defineConfig } = require("cypress");
const preprocessor = require("@badeball/cypress-cucumber-preprocessor");
const browserify = require("@badeball/cypress-cucumber-preprocessor/browserify");
const { lighthouse } = require("@cypress-audit/lighthouse");
const { pa11y, prepareAudit } = require("@cypress-audit/pa11y");

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
    STATE_USER_EMAIL: "stateuser2@test.com",
    ADMIN_USER_EMAIL: "cypressadminuser@test.com",
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
