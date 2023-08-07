//element selectors
const actionButton = "[data-testid='report-action-button']";
const certifySubmitButton = "[data-testid='certifySubmit']";

describe("CARTS Submit and Uncertify Integration Tests", () => {
  it("Should submit form as a State User and uncertify as a Reviewer", () => {
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

    cy.logout();
  });
});
