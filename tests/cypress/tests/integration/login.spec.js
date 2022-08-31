// element selectors
const cognitoLoginButton = "[data-testid='login-button']";
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";

describe("CARTS Login Integration Tests", () => {
  before(() => {
    cy.visit("/");
  });

  it("Should authenticate as a State User", () => {
    cy.authenticate("stateUser");
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
  });

  it("Should authenticate as Admin User", () => {
    cy.authenticate("adminUser");
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
  });

  it("Should display Login screen after logging out", () => {
    cy.location("pathname").should("match", /\//);
    cy.get(cognitoLoginButton).should("be.visible");
  });
});
