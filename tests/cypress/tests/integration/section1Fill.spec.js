// element selectors
const actionButton = "[data-testid='report-action-button']";
const navigationLink = "[aria-label='Vertical Navigation Element'] a";

describe("CARTS Report Fill Tests", () => {
  before(() => {
    Cypress.session.clearAllSessionData;
  });

  it("Should fill out some answers in Section 1", () => {
    cy.ensureAvailableReport(); // Needs to happen each iteration of the test

    // log in as State User
    cy.authenticate("stateUser");

    // enter report
    cy.get(actionButton, { timeout: 30000 }).contains("Edit").click();
    cy.wait(3000);

    //Set Report Type to Combo to ensure theres a section 1 to fill
    cy.get("legend")
      .contains("Program type")
      .siblings()
      .find("label")
      .contains("Both Medicaid Expansion")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Navigate to Section 1
    cy.get(navigationLink, { timeout: 3000 }).contains("Section 1").click();
    cy.wait(3000);

    // Question 1
    cy.get("legend")
      .contains("Does your program charge an enrollment fee")
      .siblings()
      .find("label")
      .contains("Yes")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 1 - Swap from Yes to No
    cy.get("legend")
      .contains("Does your program charge an enrollment fee")
      .siblings()
      .find("label")
      .contains("No")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 2
    cy.get("legend")
      .contains("Does your program charge premiums")
      .siblings()
      .find("label")
      .contains("Yes")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 2a
    cy.get("legend")
      .contains("Are your premiums for one child tiered")
      .siblings()
      .find("label")
      .contains("Yes")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 2b
    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("label")
      .contains("label", "FPL starts at")
      .siblings()
      .find("input")
      .clear()
      .type("0");

    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("label")
      .contains("label", "FPL ends at")
      .siblings()
      .find("input")
      .clear()
      .type("10");

    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("label")
      .contains("label", "Premium starts at")
      .siblings()
      .find("input")
      .clear()
      .type("22");

    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("label")
      .contains("label", "Premium ends at")
      .siblings()
      .find("input")
      .clear()
      .type("44");

    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("button")
      .contains("Add another")
      .click();

    cy.wait(50);

    cy.get("legend")
      .contains("Indicate the range")
      .siblings()
      .find("button")
      .contains("Remove Last")
      .click();

    // Question 3
    cy.get("legend")
      .contains("Is the maximum premium a family")
      .siblings()
      .find("label")
      .contains("Yes")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 3 - Swap to No to fill in 3b
    cy.get("legend")
      .contains("Is the maximum premium a family")
      .siblings()
      .find("label")
      .contains("No")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Question 3b
    cy.get("legend")
      .contains(
        "What's the maximum premium a family would be charged each year"
      )
      .siblings()
      .find("input")
      .clear()
      .type("123");

    // Question 4
    cy.get("label")
      .contains("Do premiums differ")
      .contains("explain")
      .siblings()
      .find("textarea")
      .clear()
      .type("The premium differences are simply inexplicable.");

    // Question 5
    cy.get("legend")
      .contains("Which delivery system")
      .siblings()
      .find("label")
      .contains("Managed Care")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    cy.get("legend")
      .contains("Which delivery system")
      .siblings()
      .find("label")
      .contains("Primary Care Case")
      .then((label) => {
        cy.get(`#${label.attr("for")}`).check();
      });

    // Wait for the autosave to go through
    cy.wait(3000);

    // The success message may be "Saved" or "Last saved at h:mm (x minutes ago)"
    cy.get(".save-status").contains("Saved", { matchCase: false });
  });
});
