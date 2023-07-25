import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

// element selectors
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";
const actionButton = "[data-testid='report-action-button']";
const certifySubmitButton = "[data-testid='certifySubmit']";
const uncertifyButton = "[data-testid='uncertifyButton']";

When("I uncertify an existing program", () => {
  cy.wait(15000);

  cy.get("body").then(($body) => {
    if ($body.text().includes("Uncertify")) {
      cy.wait(3000);
      cy.get(uncertifyButton).first().click();
      cy.get("button").contains("Yes, Uncertify").click();
    }
    cy.wait(3000);
    return;
  });
});

Then("I log out", () => {
  cy.get(headerDropdownMenu).click();
  cy.get(logoutButton).click();
});

Then("I certify and submit report", () => {
  cy.get(actionButton, { timeout: 30000 }).contains("Edit").click();
  cy.contains("Certify and Submit").click();
  cy.get(certifySubmitButton).click();
  cy.get("button").contains("Confirm Certify and Submit").click();
  cy.get("button").contains("Return Home").click();
});

Then("I uncertify a report", () => {
  cy.get(uncertifyButton).first().contains("Uncertify").click();
  cy.get("button").contains("Yes, Uncertify").click();
  cy.wait(3000);
});

Then("the report should be 'In Progress' again", () => {
  cy.get(actionButton).contains("Edit").should("be.visible");
});
