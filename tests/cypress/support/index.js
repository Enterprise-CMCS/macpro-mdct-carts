{
  require("cypress-xpath");
}
import "./commands";
import "cypress-axe";

// eslint-disable-next-line no-unused-vars
Cypress.on("uncaught:exception", (err, runnable) => {
  // returning false here prevents Cypress from failing the test
  return false;
});
