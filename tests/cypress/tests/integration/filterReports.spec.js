describe("Check Report Filtering as CMS Reviewer and Help Desk User", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.authenticate("adminUser");
  });

  beforeEach(() => {
    cy.get('[data-cy="cms-homepage-filter-clear"]').click();
  });

  it("Should display all provided reports when no filters activated", () => {
    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").children().should("have.length", 3);
  });

  it("Should display the correct reports when filtered by state", () => {
    cy.get('[data-cy="cms-homepage-state-dropdown"] > div > div > div').as(
      "state-dropdown"
    );
    cy.get("@state-dropdown").click();

    cy.get('[data-cy="cms-homepage-state-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfStates");
    cy.get("@listOfStates").children().contains("Alabama").click();

    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").click();

    cy.get('[data-cy="cms-homepage-filter-submit"]').click();
    cy.get("@reports").children().should("have.length", 2);
  });

  it("Should display the correct reports when filtered by year", () => {
    cy.get('[data-cy="cms-homepage-year-dropdown"] > div > div > div').as(
      "year-dropdown"
    );
    cy.get("@year-dropdown").click();

    cy.get('[data-cy="cms-homepage-year-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfYears");
    cy.get("@listOfYears").children().contains("2021").click();

    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").click();

    cy.get('[data-cy="cms-homepage-filter-submit"]').click();
    cy.get("@reports").children().should("have.length", 2);
  });

  it("Should display the correct reports when filtered by status", () => {
    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div > div').as(
      "status-dropdown"
    );
    cy.get("@status-dropdown").click();

    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfStatuses");
    cy.get("@listOfStatuses").children().contains("In Progress").click();

    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").click();

    cy.get('[data-cy="cms-homepage-filter-submit"]').click();
    cy.get("@reports").children().should("have.length", 2);
  });

  it("Should display the correct reports with multiple filters active", () => {
    cy.get('[data-cy="cms-homepage-state-dropdown"] > div > div > div').as(
      "state-dropdown"
    );
    cy.get("@state-dropdown").click();

    cy.get('[data-cy="cms-homepage-state-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfStates");
    cy.get("@listOfStates").children().contains("Alabama").click();

    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div > div').as(
      "status-dropdown"
    );
    cy.get("@status-dropdown").click();

    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfStatuses");
    cy.get("@listOfStatuses").children().contains("In Progress").click();

    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").click();

    cy.get('[data-cy="cms-homepage-filter-submit"]').click();
    cy.get("@reports").children().should("have.length", 1);
  });

  it("Should display no results when filters do not match reports", () => {
    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div > div').as(
      "status-dropdown"
    );
    cy.get("@status-dropdown").click();

    cy.get('[data-cy="cms-homepage-status-dropdown"] > div > div')
      .find(".dropdown-content")
      .as("listOfStatuses");
    cy.get("@listOfStatuses").children().contains("Not Started").click();

    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").click();

    cy.get('[data-cy="cms-homepage-filter-submit"]').click();
    cy.get("@reports").children().should("have.length", 0);
  });

  it("Should display all reports after clearing filters", () => {
    cy.get('[data-cy="cms-homepage-filter-clear"]').click();
    cy.get('[data-cy="cms-homepage-reports"]').as("reports");
    cy.get("@reports").children().should("have.length", 3);
  });
});
