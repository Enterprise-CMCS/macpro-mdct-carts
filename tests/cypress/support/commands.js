/* eslint-disable no-console */

import "cypress-file-upload";
import "@cypress-audit/pa11y/commands";
import "@cypress-audit/lighthouse/commands";

before(() => {
  cy.visit("/", { timeout: 60000 * 5 });
});

const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";
const uncertifyButton = "[data-testid='uncertifyButton']";
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";

const stateUser = {
  email: Cypress.env("STATE_USER_EMAIL"),
  password: Cypress.env("STATE_USER_PASSWORD"),
};

const adminUser = {
  email: Cypress.env("ADMIN_USER_EMAIL"),
  password: Cypress.env("ADMIN_USER_PASSWORD"),
};

const reviewer = {
  email: Cypress.env("REVIEWER_USER_EMAIL"),
  password: Cypress.env("REVIEWER_USER_PASSWORD"),
};

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  cy.reload();
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
        credentials = "cms.admin@test.com";
        break;
      case "stateUser":
        credentials = "stateuser2@test.com";
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
  cy.xpath(emailForCognito).type(credentials);
  cy.xpath(passwordForCognito).type("Dm!H@wP2YBdQ");
  cy.get('[data-cy="login-with-cognito-button"]').click();
});

Cypress.Commands.add("logout", () => {
  cy.wait(3000);
  cy.get(headerDropdownMenu).click();
  cy.get(logoutButton).click();
  cy.wait(3000); // let logout settle
  cy.visit("/");
});

Cypress.Commands.add("ensureAvailableReport", () => {
  // login as admin
  cy.visit("/");
  cy.authenticate("adminUser");

  /*
   * check if there is a certified program, if so, uncertify
   * so state user will always have an editable program
   */
  // Scope to test user's state
  cy.get(".dropdown-heading").first().click();
  cy.contains("Alabama").click();
  cy.get("body").click(0, 0);
  cy.get(".filter-button").contains("Filter").click();
  cy.wait(3000);

  cy.get("body").then(($body) => {
    if ($body.find(uncertifyButton).length > 0) {
      cy.get(uncertifyButton).first().click();
      cy.get("button").contains("Yes, Uncertify").click();
    }
    return;
  });

  cy.logout();
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
});
