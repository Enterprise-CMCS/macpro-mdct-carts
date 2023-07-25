import { When, Then } from "@badeball/cypress-cucumber-preprocessor";

// element selectors
const cognitoLoginButton = "[data-testid='login-button']";
const logoutButton = "[data-testid='header-menu-option-log-out']";
const headerDropdownMenu = "[data-testid='headerDropDownMenu']";

When("I navigate to the user profile page", () => {
  cy.get(headerDropdownMenu).click();
  const manageAccountButton = "[data-testid='manageAccountButton']";
  cy.get(manageAccountButton).click();
});

Then("the role is {string}", (userRole) => {
  cy.findByText(userRole);
});

When("I log out", () => {
  cy.get(headerDropdownMenu).click();
  cy.get(logoutButton).click();
});

Then("I see the login button", () => {
  cy.location("pathname").should("match", /\//);
  cy.get(cognitoLoginButton).should("be.visible");
});
