// element selectors
const actionButton = "[data-testid='report-action-button']";
const certifySubmitButton = "[data-testid='certifySubmit']";
const uncertifyButton = "[data-testid='uncertifyButton']";
describe("CARTS Submit and Uncertify Integration Tests", () => {
  before(() => {
    Cypress.session.clearAllSessionData;
  });

  it("Should submit form as a State User and uncertify as an Admin", () => {
    cy.ensureAvailableReport(); // Needs to happen each iteration of the test

    // log in as State User
    cy.authenticate("stateUser");

    // certify and submit report
    cy.get(actionButton, { timeout: 30000 }).contains("Edit").click();
    cy.wait(3000);
    cy.contains("Certify and Submit").click();
    cy.wait(3000);

    cy.get(certifySubmitButton).click();
    cy.get("button").contains("Confirm Certify and Submit").click();
    cy.get("button").contains("Return Home").click();

    // log in as CMS Admin (user who can uncertify)
    cy.authenticate("adminUser");

    // uncertify report - Scope to test user's state
    cy.get(".dropdown-heading").first().click();
    cy.wait(500);
    cy.contains("Alabama").click();
    cy.get("body").click(0, 0);
    cy.get(".filter-button").contains("Filter").click();
    cy.wait(3000);

    cy.get(uncertifyButton).first().contains("Uncertify").click();
    cy.get("button").contains("Yes, Uncertify").click();

    // log back in as State User - the report should be "In Progress" again
    cy.authenticate("stateUser");
    cy.get(actionButton).contains("Edit").should("be.visible");
  });
});
