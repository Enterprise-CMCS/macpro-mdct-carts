// element selectors
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";
const actionButton = "[data-testid='report-action-button']";
const certifySubmitButton = "[data-testid='certifySubmit']";
const uncertifyButton = "[data-testid='uncertifyButton']";

describe("CARTS Submit and Uncertify Integration Tests", () => {
  before(() => {
    cy.visit("/");
  });

  it("Should submit form as a State User and uncertify as a Reviewer", () => {
    // generate the forms
    cy.authenticate("adminUser");
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();

    // log in as State User
    cy.authenticate("stateUser");

    // certify and submit report
    cy.get(actionButton, { timeout: 30000 }).contains("Edit").click();
    cy.contains("Certify and Submit").click();
    cy.get(certifySubmitButton).click();
    cy.get("button").contains("Confirm Certify and Submit").click();
    cy.get("button").contains("Return Home").click();

    // log out
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();

    // log in as CMS User (Reviewer)
    cy.authenticate("reviewer");

    // uncertify report
    cy.get(uncertifyButton).first().contains("Uncertify").click();
    cy.get("button").contains("Yes, Uncertify").click();

    cy.wait(3000);

    // log back out
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();

    // log back in as State User
    cy.authenticate("stateUser");

    // the report should be "In Progress" again
    cy.get(actionButton).contains("Edit").should("be.visible");
  });
});
