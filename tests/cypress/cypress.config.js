const { defineConfig } = require("cypress");

module.exports = defineConfig({
  experimentalStudio: true,
  redirectionLimit: 20,
  retries: 2,
  watchForFileChanges: true,
  fixturesFolder: "fixtures",
  screenshotsFolder: "screenshots",
  videosFolder: "videos",
  downloadsFolder: "downloads",
  defaultCommandTimeout: 20000,
  types: ["cypress", "cypress-axe"],
  e2e: {
    setupNodeEvents(on, config) {
      return require("./plugins/index.js")(on, config);
    },
    baseUrl: "http://localhost:3000/",
    specPattern: ["tests/**/*.feature", "tests/**/*.spec.js"],
    excludeSpecPattern: "filterReports.spec.js",
    supportFile: "support/index.js",
  },
});
