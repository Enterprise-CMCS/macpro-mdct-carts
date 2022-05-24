import "cypress-file-upload";
import "@cypress-audit/pa11y/commands";
import "@cypress-audit/lighthouse/commands";

before(() => {
  cy.visit("/", { timeout: 60000 * 5 });
});

const emailForCognito = "//input[@name='email']";
const passwordForCognito = "//input[@name='password']";

Cypress.Commands.add("loginAsStateUser", (user = "stateuser1") => {
  cy.xpath(emailForCognito).type(`${user}@test.com`);
  cy.xpath(passwordForCognito).type("p@55W0rd!");
  cy.get('[data-cy="login-with-cognito-button"]').click();
});

Cypress.Commands.add("loginAsAdminUser", (user = "adminuser") => {
  cy.xpath(emailForCognito).type(`${user}@test.com`);
  cy.xpath(passwordForCognito).type("p@55W0rd!");
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
    accessibility: 90,
  });
});
