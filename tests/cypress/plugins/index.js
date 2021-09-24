module.exports = (on, config) => {
  config.baseUrl = process.env.APPLICATION_ENDPOINT || "http://localhost:3000";

  return config;
};
const cucumber = require("cypress-cucumber-preprocessor").default;

module.exports = (on, config) => {
  on("file:preprocessor", cucumber());
};