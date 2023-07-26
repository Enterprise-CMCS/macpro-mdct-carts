const cognitoUserEmail = "input[@name='email']";
const cognitoUserPassword = "input[@name='password']";
const cognitoLoginButton = "button[@data-cy='login-with-cognito-button']";

export class LoginPage {
  enterEmailwithCognitoLogin() {
    cy.get(cognitoUserEmail).type("stateuser1@test.com");
  }

  enterPasswordwithCognitoLogin() {
    cy.get(cognitoUserPassword).type("p@55W0rd!");
  }

  stateCognitoLogin() {
    cy.get(cognitoUserEmail).type("adminuser@test.com");
    cy.get(cognitoUserPassword).type("p@55W0rd!");
    cy.get(cognitoLoginButton).click();
  }

  approverCognitoLogin() {
    cy.get(cognitoUserEmail).type("adminuser@test.com");
    cy.get(cognitoUserPassword).type("p@55W0rd!");
    cy.get(cognitoLoginButton).click();
  }
}

export default LoginPage;
