describe("Check A11y on Common Pages", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.loginAsStateUser();
  });

  it("Check a11y on Home Page", () => {
    cy.checkA11yOfPage();
  });
});
