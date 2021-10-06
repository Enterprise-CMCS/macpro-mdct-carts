const usernameInput = "input#okta-signin-username";
const passwordInput = "input#okta-signin-password";
const agreeTermCondition = "input#tandc";
const signInBttn = "input#okta-signin-submit";

export class LoginPage {
  enterUserName() {
    cy.get(usernameInput).type("MDCT_Test");
  }

  enterPassword() {
    cy.get(passwordInput).type("QC1a2r3t4!");
  }

  clickAgreeTermAndConditions() {
    cy.get(agreeTermCondition).click();
  }

  clickSignIn() {
    cy.get(signInBttn).click();
  }
}
export default LoginPage;
