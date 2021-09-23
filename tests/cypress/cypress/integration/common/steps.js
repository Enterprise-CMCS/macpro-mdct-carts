import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";
import Homepage from '../../../support/pages/Homepage';
import LoginPage from '../../../support/pages/LoginPage';
import Landingpage from "../../../support/pages/Landingpage";

const homePage = new Homepage();
const loginPage = new LoginPage();
const landingPage = new Landingpage();

Given('user visits QMR home page', ()=>{
   homePage.launch();
})

When('QMR home page is displayed to the user',()=>{
    homePage.validateCoreSetReportingIcon();
})

When('QMR landing page is displayed to the user',()=>{
    landingPage.validateCoreSetReportingIcon();
})

Then('user can see "Your APS Submissions" page banner',()=>{
    landingPage.validatePageBanner();
})

And('user can see My Account link',()=>{
    landingPage.validateMyAccountButton();
})

Then('user can see "APS Submission App" page banner', ()=>{
    homePage.validatePageBanner();
    homePage.validateSupportSenence();
})

And('user can see login link', ()=>{
    homePage.validateLoginButton();
})

And('user can see the footer', ()=>{
   homePage.validateMedicaidLogo();  // verify footer medicaid logo 
   homePage.validateEmail();         // verify footer the email 
   homePage.validateFederalLogo();   // verify footer the federal logo 
   homePage.validateAddress();       // varify the footer address 
})

When('user clicks on "Login" link',()=>{
    homePage.clickLoginButton();
})

And('user enter username and password', ()=>{
   //loginPage.enterUserName("A185");
   //loginPage.enterPassword("B782963c");
   loginPage.enterUserName();
   loginPage.enterPassword();
})

And('user click "Sign In" button', ()=>{
  loginPage.clickSignIn();
})

Then('user should see the QMR home page', ()=>{
  
})


// ---- hints -----------
//  cy.get(submitBTN).click();                                       -- clicking 
//  cy.xpath(respondToRAI).click();                                  -- clicking xpath
//  cy.get(AdditionalInformationBox).type('This is just a test');    -- typing
//  cy.get(errorMessageForWaiverNumber).should('be.visible');        -- visible
//  cy.xpath(submissionList).should('be.visible')                    -- visible xpath
//  cy.get(errorMessageForWaiverNumber).should('not.exist');         -- assert not visible
//  cy.get(waiverNumberInputBox).clear();                            -- clear text
//  cy.get(successMessage).contains('Submission Completed');         -- text assertion 
//  cy.xpath(location).contains('word');                             -- text assertion xpath
//  cy.wait(5000);                                                   -- waiting