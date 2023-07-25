/*
 * Global configuration and behavior that modifies Cypress.
 * Read more here: https://on.cypress.io/configuration
 */

import "@cypress/xpath";
import "cypress-axe";
import "cypress-wait-until";
import "./accessibility";
import "./authentication";
import "@testing-library/cypress/add-commands";

// eslint-disable-next-line no-unused-vars
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});
