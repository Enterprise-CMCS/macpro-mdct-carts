// element selectors
const cognitoLoginButton = "[data-testid='login-button']";
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";

describe("CARTS Login Integration Tests", () => {
  before(() => {
    cy.wait(3000);
    cy.visit("/", { failOnStatusCode: false });
  });

  it("Should authenticate as a State User", () => {
    cy.authenticate("stateUser");
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
    cy.wait(3000); // let logout settle
    cy.visit("/", { failOnStatusCode: false });
  });

  it("Should authenticate as Admin User", () => {
    cy.authenticate("adminUser");
    cy.get(headerDropdownMenu).click();
    cy.get(logoutButton).click();
    cy.wait(3000); // let logout settle
    cy.visit("/", { failOnStatusCode: false });
  });

  it("Should display Login screen after logging out", () => {
    cy.location("pathname").should("match", /\//);
    cy.wait(3000, { failOnStatusCode: false });
    cy.get(cognitoLoginButton).should("be.visible");
  });
});
