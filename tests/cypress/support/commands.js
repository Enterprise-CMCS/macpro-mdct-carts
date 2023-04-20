/* eslint-disable no-console */

import "cypress-file-upload";
import "@cypress-audit/pa11y/commands";
import "@cypress-audit/lighthouse/commands";

before(() => {
  cy.visit("/", { timeout: 60000 * 5 });
});

const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

const stateUser = {
  email: Cypress.env("CYPRESS_STATE_USER_EMAIL"),
  password: Cypress.env("CYPRESS_STATE_USER_PASSWORD"),
};

const adminUser = {
  email: Cypress.env("CYPRESS_ADMIN_USER_EMAIL"),
  password: Cypress.env("CYPRESS_ADMIN_USER_PASSWORD"),
};

const reviewer = {
  email: Cypress.env("CYPRESS_REVIEWER_USER_EMAIL"),
  password: Cypress.env("CYPRESS_REVIEWER_USER_PASSWORD"),
};

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  let credentials = {};
  if (userType && userCredentials) {
    console.warn(
      "If userType and userCredentials are both provided, userType is ignored and provided userCredentials are used."
    );
  } else if (userCredentials) {
    credentials = userCredentials;
  } else if (userType) {
    switch (userType) {
      case "adminUser":
        credentials = adminUser;
        break;
      case "stateUser":
        credentials = stateUser;
        break;
      case "reviewer":
        credentials = reviewer;
        break;
      default:
        throw new Error("Provided userType not recognized.");
    }
  } else {
    throw new Error("Must specify either userType or userCredentials.");
  }
  cy.xpath(emailForCognito).type(credentials.email);
  cy.xpath(passwordForCognito).type(credentials.password);
  cy.get('[data-cy="login-with-cognito-button"]').click();
});

// Define at the top of the spec file or just import it
function terminalLog(violations) {
  cy.task(
    "log",
    `${violations.length} accessibility violation${
      violations.length === 1 ? "" : "s"
    } ${violations.length === 1 ? "was" : "were"} detected`
  );
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    })
  );

  cy.task("table", violationData);
}

// axe api documentation: https://www.deque.com/axe/core-documentation/api-documentation/
Cypress.Commands.add("checkA11yOfPage", () => {
  cy.wait(3000);
  cy.injectAxe();
  cy.checkA11y(
    null,
    {
      values: ["wcag2a", "wcag2aa"],
      includedImpacts: ["minor", "moderate", "serious", "critical"], // options: "minor", "moderate", "serious", "critical"
    },
    terminalLog,
    true // does not fail tests for ally violations
  );

  // check for a11y using pa11y
  cy.pa11y({
    threshold: 10,
    standard: "WCAG2AA",
  });

  // check for a11y using Lighthouse
  cy.lighthouse({
    // TODO: [MDCT-301] Fix lighthouse accessibility score to increase this back to 90.
    accessibility: 80,
  });
});
