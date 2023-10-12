// element selectors
const actionButton = "[data-testid='report-action-button']";
const navigationLink = "[aria-label='Vertical Navigation Element'] a";

describe("CARTS Report Fill Tests", () => {
  it("Should fill out some answers in Section 1", () => {
    cy.ensureAvailableReport(); // Needs to happen each iteration of the test

    // log in as State User
    cy.authenticate("stateUser");

    // enter report
    cy.get(actionButton, { timeout: 30000 }).contains("Edit").click();
    cy.wait(3000);

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

    // Question 1a
    cy.get("legend")
      .contains("How much is your enrollment fee")
      .siblings()
      .find("input")
      .clear()
      .type("123");

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
      .contains("Indicate the range for premiums")
      .siblings()
      .find("label")
      .contains("label", "FPL starts at")
      .siblings()
      .find("input")
      .clear()
      .type("0");

    cy.get("legend")
      .contains("Indicate the range for premiums")
      .siblings()
      .find("label")
      .contains("label", "FPL ends at")
      .siblings()
      .find("input")
      .clear()
      .type("10");

    cy.get("legend")
      .contains("Indicate the range for premiums")
      .siblings()
      .find("label")
      .contains("label", "Premium starts at")
      .siblings()
      .find("input")
      .clear()
      .type("22");

    cy.get("legend")
      .contains("Indicate the range for premiums")
      .siblings()
      .find("label")
      .contains("label", "Premium ends at")
      .siblings()
      .find("input")
      .clear()
      .type("44");

    cy.get("legend")
      .contains("Indicate the range for premiums")
      .siblings()
      .find("button")
      .contains("Add another")
      .click();

    cy.wait(50);

    cy.get("legend")
      .contains("Indicate the range for premiums")
      .siblings()
      .find("button")
      .contains("Remove Last")
      .click();

    // Question 4
    cy.get("label")
      .contains("Do premiums differ")
      .contains("explain")
      .siblings()
      .find("textarea")
      .clear()
      .type("The premium differences are simply inexplicable.");

    // Question 5
    /*
     * TODO: Why do the IDs of these inputs change,
     * depending on which of them are checked?? Seems very wrong.
     * We also have multiple inputs sharing the same ID!? Even wronger.
     * That means that clicking the <label> for Fee-for-Service
     * checks/unchecks the box for Managed Care. bug bug bug.
     * It also means that this test gets screwy if it tries to check
     * more than one box, because the DOM changes under its feet.
     */
    cy.get("legend")
      .contains("Which delivery system")
      .siblings()
      .find("input")
      .first()
      .then(($input) => {
        cy.wrap($input).check();
      });

    // Wait for the autosave to go through
    cy.wait(3000);

    // The success message may be "Saved" or "Last saved at h:mm (x minutes ago)"
    cy.get(".save-status").contains("Saved", { matchCase: false });
  });
});
