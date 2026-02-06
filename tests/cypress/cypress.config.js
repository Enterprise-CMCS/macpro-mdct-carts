const { defineConfig } = require("cypress");
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
      on("task", {
        log(message) {
          console.log(message);

          return null;
        },
        table(message) {
          console.table(message);

          return null;
        },
      });

      return config;
    },
  },
});
