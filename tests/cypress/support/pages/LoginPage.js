
const usernameInput = 'input#okta-signin-username';
const passwordInput = 'input#okta-signin-password';
const agreeTermCondition = 'input#tandc';
const signInBttn = 'input#okta-signin-submit';



export class LoginPage {

    enterUserName()
    {
        cy.get(usernameInput).type("A185");
    }

    enterPassword()
    {
        cy.get(passwordInput).type("B782963c");
    }

    clickAgreeTermAndConditions()
    {
        cy.get(agreeTermCondition).click(); 
    }

    clickSignIn()
    {
        cy.get(signInBttn).click(); 
    }
}
export default LoginPage