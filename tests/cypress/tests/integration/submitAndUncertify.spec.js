describe("CARTS Submit and Uncertify Integration Tests", () => {
  it("Should submit form as a State User and uncertify as a Reviewer", () => {
    cy.ensureAvailableReport(); // Needs to happen each iteration of the test
  });
});
