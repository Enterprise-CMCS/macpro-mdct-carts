const stateDropdownSelector = '[data-cy="cms-homepage-state-dropdown"]';
const yearDropdownSelector = '[data-cy="cms-homepage-year-dropdown"]';
const statusDropdownSelector = '[data-cy="cms-homepage-status-dropdown"]';

const reportsSelector = '[data-cy="cms-homepage-reports"]';
const filterSubmitSelector = '[data-cy="cms-homepage-filter-submit"]';
const clearFilterSelector = '[data-cy="cms-homepage-filter-clear"]';

describe("Check Report Filtering as a CMS Admin", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("adminUser");
    cy.get(clearFilterSelector).click();
  });

  it("Should display all provided reports when no filters activated", () => {
    cy.get(reportsSelector).as("reports");
  });

  it("Should display the correct reports when filtered by state", () => {
    cy.get(stateDropdownSelector).click();

    cy.get(stateDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("Alabama")
      .click();

    cy.get(reportsSelector).click();

    cy.get(filterSubmitSelector).click();
  });

  it("Should display the correct reports when filtered by year", () => {
    cy.get(yearDropdownSelector).click();

    cy.get(yearDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("2021")
      .click();

    cy.get(reportsSelector).click();

    cy.get(filterSubmitSelector).click();
  });

  it("Should display the correct reports when filtered by status", () => {
    cy.get(statusDropdownSelector).click();

    cy.get(statusDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("In Progress")
      .click();

    cy.get(reportsSelector).click();

    cy.get(filterSubmitSelector).click();
  });

  it("Should display the correct reports with multiple filters active", () => {
    cy.get(stateDropdownSelector).click();

    cy.get(stateDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("Alabama")
      .click();

    cy.get(statusDropdownSelector).click();

    cy.get(statusDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("In Progress")
      .click();

    cy.get(reportsSelector).click();

    cy.get(filterSubmitSelector).click();
  });

  it("Should display no results when filters do not match reports", () => {
    cy.get(statusDropdownSelector).click();

    cy.get(statusDropdownSelector)
      .find(".dropdown-content")
      .children()
      .contains("Not Started")
      .click();

    cy.get(reportsSelector).click();

    cy.get(filterSubmitSelector).click();
  });

  it("Should display all reports after clearing filters", () => {
    cy.get(clearFilterSelector).click();
    cy.get(reportsSelector).as("reports");
  });
});
