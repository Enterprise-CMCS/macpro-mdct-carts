// element selectors
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";
const actionButton = "[data-testid='report-action-button']";
const certifySubmitButton = "[data-testid='certifySubmit']";
const uncertifyButton = "[data-testid='uncertifyButton']";
describe("CARTS Submit and Uncertify Integration Tests", () => {
  before(() => {
    cy.visit("/");

    // login as admin
    cy.authenticate("adminUser");
    /*
     * check if there is a certified program, if so, uncertify
     * so state user will always have an editable program
     */
    cy.wait(15000);

    cy.get("body").then(($body) => {
      // Scope to test user's state
      cy.get(".dropdown-heading").first().click();
      cy.contains("Alabama").click();
      cy.get("body").click(0, 0);
      cy.get(".filter-button").contains("Filter").click();
      cy.wait(3000);

      if ($body.find(uncertifyButton).length > 0) {
        cy.get(uncertifyButton).first().click();
        cy.get("button").contains("Yes, Uncertify").click();
      }
      return;
    });

    cy.wait(3000);
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
    cy.wait(3000); // let logout settle
  });

  it("Should submit form as a State User and uncertify as a Reviewer", () => {
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

    // log out
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
    cy.wait(3000); // let logout settle

    // log in as CMS Admin (user who can uncertify)
    cy.authenticate("adminUser");

    // uncertify report - Scope to test user's state
    cy.get(".dropdown-heading").first().click();
    cy.contains("Alabama").click();
    cy.get("body").click(0, 0);
    cy.get(".filter-button").contains("Filter").click();
    cy.wait(3000);

    cy.get(uncertifyButton).first().contains("Uncertify").click();
    cy.get("button").contains("Yes, Uncertify").click();

    cy.wait(3000);

    // log back out
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
    cy.wait(3000); // let logout settle

    // log back in as State User
    cy.authenticate("stateUser");

    // the report should be "In Progress" again
    cy.get(actionButton).contains("Edit").should("be.visible");
  });
});
