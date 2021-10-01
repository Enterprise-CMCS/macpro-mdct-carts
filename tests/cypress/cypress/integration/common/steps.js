import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

//     '../../../support/pages/';
import BasicStateInformationpage from '../../../support/pages/BasicStateInformationpage';
import Homepage from '../../../support/pages/Homepage';
import Landingpage from "../../../support/pages/Landingpage";
import LoginPage from '../../../support/pages/LoginPage';
import Section1Page from '../../../support/pages/Section1page';
import Section2Page from '../../../support/pages/Section2page';
import Section3APage from '../../../support/pages/Section3Apage';
import Section3BPage from '../../../support/pages/Section3Bpage';
import Section3CPage from  '../../../support/pages/Section3Cpage';
import Section3DPage from  '../../../support/pages/Section3Dpage';
import Section3EPage from  '../../../support/pages/Section3Epage';
import Section3FPage from  '../../../support/pages/Section3Fpage';
import Section3GPage from  '../../../support/pages/Section3Gpage';
import Section3HPage from  '../../../support/pages/Section3Hpage';
import Section3IPage from  '../../../support/pages/Section3Ipage';
import Section4Page from  '../../../support/pages/Section4page';
import Section5Page from  '../../../support/pages/Section5page';
import Section6Page from  '../../../support/pages/Section6page';

// Page object declaration
const basicStateInfoPage = new BasicStateInformationpage();
const homePage = new Homepage();
const landingPage = new Landingpage();
const loginPage = new LoginPage();
const section1Page = new Section1Page();
const section2Page = new Section2Page();
const section3aPage = new Section3APage();
const section3bPage = new Section3BPage();
const section3cPage = new Section3CPage();
const section3dPage = new Section3DPage();
const section3ePage = new Section3EPage();
const section3fPage = new Section3FPage();
const section3gPage = new Section3GPage();
const section3hPage = new Section3HPage();
const section3iPage = new Section3IPage();
const section4Page = new Section4Page();
const section5Page = new Section5Page();
const section6Page = new Section6Page();




Given('user visits QMR home page', ()=>{
   homePage.launch();
})

Given('user visits Carts home page', ()=>{
   landingPage.launch();
})

When('logins with valid username and password', ()=>{
   loginPage.enterUserName();
   loginPage.enterPassword();
   loginPage.clickAgreeTermAndConditions();
   loginPage.clickSignIn();
})

Then('user can see Carts landing page', ()=>{
   landingPage.validateLandingPageTitle();
})


Given('user sees the 2020 report', ()=>{
   landingPage.validateReport();
})

When('user clicks on the Edit link',()=>{
    landingPage.clickEditLink();
})

Then('user sees report edit page',()=>{
    landingPage.verifyReportPageVisibility();
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
