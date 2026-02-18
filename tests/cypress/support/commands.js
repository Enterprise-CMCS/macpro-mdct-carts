import "cypress-file-upload";

before(() => {
  cy.visit("/", { timeout: 60000 * 5, failOnStatusCode: false });
});

const emailForCognito = "input[name='email']";
const passwordForCognito = "input[name='password']";
const uncertifyButton = "[data-testid='uncertifyButton']";

const stateUser = {
  email: Cypress.env("STATE_USER_EMAIL"),
  password: Cypress.env("STATE_USER_PASSWORD"),
};

const adminUser = {
  email: Cypress.env("ADMIN_USER_EMAIL"),
  password: Cypress.env("ADMIN_USER_PASSWORD"),
};

Cypress.Commands.add("authenticate", (userType, userCredentials) => {
  cy.session([userType, userCredentials], () => {
    cy.visit("/");
    cy.wait(2000);
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
        default:
          throw new Error("Provided userType not recognized.");
      }
    } else {
      throw new Error("Must specify either userType or userCredentials.");
    }
    cy.get(emailForCognito).type(credentials.email);
    cy.get(passwordForCognito).type(credentials.password, { log: false });
    cy.get('[data-cy="login-with-cognito-button"]').click();

    /**
     * Waits for cognito session tokens to be set in local storage before saving session
     * This ensures reused sessions maintain these tokens
     * We expect at least three for the id, access, and refresh tokens
     */
    cy.wait(4500);
  });
  cy.navigateToHomePage();
});

Cypress.Commands.add("clearSession", () => {
  cy.session([], () => {});
});

Cypress.Commands.add("navigateToHomePage", () => {
  if (cy.location("pathname") !== "/") cy.visit("/");
  cy.wait(3000);
});

Cypress.Commands.add("ensureAvailableReport", () => {
  // login as admin
  cy.visit("/");
  cy.authenticate("adminUser");
  cy.navigateToHomePage();

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

      cy.get("dialog[open]", { timeout: 3000 }).should("be.visible");

      cy.get("dialog[open]")
        .find("button")
        .contains("Yes, Uncertify")
        .should("be.visible")
        .click();
    }
    return;
  });
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
      values: [
        "wcag2a",
        "wcag2aa",
        "wcag21a",
        "wcag21aa",
        "wcag22aa",
        "best-practice",
      ],
      includedImpacts: ["minor", "moderate", "serious", "critical"],
      rules: {
        "duplicate-id": { enabled: false },
      },
    },
    terminalLog
  );
});
