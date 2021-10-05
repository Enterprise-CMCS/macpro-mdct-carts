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

And('logins with valid username and password', ()=>{
   loginPage.enterUserName();
   loginPage.enterPassword();
   loginPage.clickAgreeTermAndConditions();
   loginPage.clickSignIn();
   cy.wait(5000); 
})

And('user can see Carts landing page', ()=>{
   landingPage.validateLandingPageTitle();
})

Given('user sees the 2020 report', ()=>{
   landingPage.validateReport();
})

Then('user sees the Welcome title',()=>{
   basicStateInfoPage.validateWelcomeBanner();
})


And('verify "Both medicaid Expansion CHIP and Separate CHIP" is selected for Program type',()=>{
   basicStateInfoPage.verifyProgramType();
})

And('verify "Alabama" is entered for state territory name',()=>{
   basicStateInfoPage.verifyStateTeritoryName();
})

And('verify "ALL Kids" is entered for CHIP program name',()=>{
   basicStateInfoPage.verifyCHIPprogramNameInput();
})

And('verify "Teela Sanders" is entered for Contact name',()=>{
   basicStateInfoPage.verifyContactNameInput();
})

And('verify "Director" is entered for Job title',()=>{
   basicStateInfoPage.verifyJobTitleInput();
})

And('verify "teela.sanders@adph.state.al.us" is entered for Email',()=>{
   basicStateInfoPage.verifyEmailInput();
})

And('verify "Alabama Department of Public Health, CHIP PO Box 303017 Montgomery, AL 36130" is entered for Full mailling address',()=>{
   basicStateInfoPage.verifyFullMailingAddressInput();
})

And('verify "334-206-5568" is entered for Phone number',()=>{
   basicStateInfoPage.verifyPhoneNumberInput();
})

And('verify PRA Disclosure Statement is presented',()=>{
   basicStateInfoPage.verifyDisclosureStatement();
})

And('verify Next button is presented',()=>{
   basicStateInfoPage.verifyNextButton();
})

When('user clicks on the Edit link',()=>{
    landingPage.clickEditLink();
})

When('user clicks on the Section 1: Program Fees and Policy Changes link',()=>{
     section1Page.clickOnSection1();
})

Then('user sees the Program Fees and Policy Changes title',()=>{
     section1Page.verifytheTitle();
})

And('verify information in Part 1',()=>{
     section1Page.verifyInformationPart1();
})

And('verify information in Part 2',()=>{
      section1Page.verifyInformationPart2();
})

And('verify information in Part 3',()=>{
      section1Page.verifyInformationPart3();
})

And('verify information in Part 4',()=>{
      section1Page.verifyInformationPart4();
})

And('verify Next button is presented',()=>{
      section1Page.verifyPreviousButton();
})

And('verify Previous button is presented',()=>{
      section1Page.verifyNextButton();
})

When('user clicks on the Section 2: Enrollment and Uninsured Data',()=>{
      section2Page.clickOnSection2();
})

Then('user sees the Enrollment and Uninsured Data title',()=>{
      section2Page.verifytheSection2Title();
})

And('verify information in Part 1',()=>{
      section2Page.verifyInformationPart1();
})

And('verify information in Part 2',()=>{
      section2Page.verifyInformationPart2();
})

And('verify Next button is presented',()=>{
      section2Page.verifyPreviousButton();
})

And('verify Previous button is presented',()=>{
      section2Page.verifyNextButton();
})

And('user clicks on the Basic State Information link',()=>{
   landingPage.clickBasicStateInfoTab();
})

And('user sees report edit page',()=>{
    landingPage.verifyReportPageVisibility();
})

When('user clicks on the Section 3B: Substitution of Coverage',()=>{
     section3bPage.clickSection3BLink();
})

Then('user sees the Substitution of Coverage title',()=>{
   section3bPage.verifySection3Title();
})

And('verify selected No for question 1',()=>{
   section3bPage.verifyQuestion1();
})

And('verify selected No for question 2',()=>{
   section3bPage.verifyQuestion2();
})

And('verify data enter box for question 3',()=>{
   section3bPage.verifyQuestion3();
})

And('verify text is entered in question 5',()=>{
   section3bPage.verifyQuestion5();
})

And('verify Choose Files button is presented in question 6',()=>{
   section3bPage.verifyFileUploadButton();
})

And('verify Hide Uploaded button is presented in question 6',()=>{
   section3bPage.verifyHideUploadButton();
})

And('verify Next button is presented',()=>{
   section3bPage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
   section3bPage.verifyPreviousButton();
})

When('user clicks on the Section 3D: Cost Sharing (Out-of-Pocket Costs)',()=>{
   section3dPage.clickSection3D();
})

Then('user sees the Cost Sharing (Out-of-Pocket Costs) title',()=>{
   section3dPage.verify3dtitle();
})

And('verify text under title',()=>{
   section3dPage.verifyText();
})

And('verify Next button is presented',()=>{
   section3dPage.verifyPreviousButton();
})

And('verify Previous button is presented',()=>{
   section3dPage.verifyNextButton();
})


When('user clicks on the Section 3A: Program Outreach',()=>{
    section3aPage.clickOnSection3a();
})

Then('user sees the Program Outreach title',()=>{
   section3aPage.verifytheTitle();
})

And('verify selected No for question 1',()=>{
   section3aPage.verifyQuestion1();
})

And('verify selected No for question 2',()=>{
   section3aPage.verifyQuestion2();
})

And('verify text is entered in question 3',()=>{
   section3aPage.verifyQuestion3();
})

And('verify text is entered in question 4',()=>{
   section3aPage.verifyQuestion4();
})

And('verify Choose Files button is presented in Part2 question 5',()=>{
   section3aPage.verifyChooseFileButton();
})

And('verify Hide Uploaded button is presented in Part2 question 5',()=>{
   section3aPage.verifyhideUploadButton();
})

And('verify Next button is presented',()=>{
   section3aPage.verifyPreviousButton();
})

And('verify Previous button is presented',()=>{
   section3aPage.verifyNextButton();
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
