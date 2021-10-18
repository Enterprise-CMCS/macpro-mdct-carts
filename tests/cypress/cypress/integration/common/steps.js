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
import Section4ExPage from "../../../support/pages/Section4ExPage";

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
const section4expage = new Section4ExPage();




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

When('user clicks on the Section 5: Program Financing',()=>{
     section5Page.clickSection5();
})

Then('user sees the Program Financing title',()=>{
     section5Page.verifySection5Title();
})

And('verify section 5 information in Part1',()=>{
     section5Page.verifyPart1();
})

And('verify section 5 information in Part2',()=>{
     section5Page.verifyPart2();
})

And('verify section 5 information in Part3',()=>{
     section5Page.verifyPart3();
})

And('verify section 5 information in Part4',()=>{
      section5Page.verifyPart4();
})

And('verify section 5 information in Part5',()=>{
      section5Page.verifyPart5();
})

And('verify Next button is presented',()=>{
     section5Page.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section5Page.verifyPreviousButton();
})

When('user clicks on the Section 4: State Plan Goals and Objectives',()=>{
      section4expage.clickSection4link();
})

Then('user sees the State Plan Goals and Objectives title',()=>{
      section4expage.verifySection4Title();
})

And('verify information in textarea ',()=>{
      section4expage.verifyTextAreas();
})

And('verify information in text inputs',()=>{
      section4expage.verifyTextInputs();
})

And('verify information in radio inputs',()=>{
      section4expage.verifyRadioInputs();
})

And('verify information in upload button',()=>{
      section4expage.verifyUploadButtons();
})

And('verify information in hide upload button',()=>{
      section4expage.verifyHideUploadButtons();
})

And('verify information in delete last item button',()=>{
      section4expage.verifyDeleteLastItemButtons();
})

And('verify information in add another item button',()=>{
      section4expage.verifyAddAnotherItemButtons();
})

And('verify information in all labels',()=>{
      section4expage.verifyAllLabels();
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

// ------ SECTION 3C -----------//

When('user clicks on the Section 3C: Renewal Denials, and Retention',()=>{
   section3cPage.clickSectionCfLink();
})

Then('user sees the Renewal Denials, and Retention title',()=>{
   section3cPage.verifySection3CTitle();
})

And('verify section 3c information in textarea',()=>{
   section3cPage.verifyAllTextareas();
})

And('verify section 3c disabled text inputs',()=>{
   section3cPage.verifyAllDisabledTextInputs();
})

And('verify section 3c enabled text inputs',()=>{
  section3cPage.verifyAllEnabledTextInputs(); 
})

And('verify section 3c tables',()=>{
   section3cPage.verifyAllTables();
})

And('verify section 3c radio button lables',()=>{
   section3cPage.verifyAllRadioBttnLables();
})

// ----------------//


When('user clicks on the Section 3F: Program Integrity',()=>{
      section3fPage.clickSection3fLink();
})

Then('user sees the Program Integrity title',()=>{
      section3fPage.verifySection3title();
})

And('verify selected No for question 1',()=>{
      section3fPage.verifyQuestion1();
})

And('verify selected No for question 2',()=>{
      section3fPage.verifyQuestion2();
})

And('verify selected No for question 3',()=>{
       section3fPage.verifyQuestion3();
})

And('verify text is entered in question 4',()=>{
       section3fPage.verifyQuestion4();
})

And('verify N/A is selected in question 5',()=>{
       section3fPage.verifyQuestion5();
})

And('verify data is entered for question 6',()=>{
       section3fPage.verifyQuestion6();
})

And('verify data is entered for question 7',()=>{
      section3fPage.verifyQuestion7();
})

And('verify data is entered for question 8',()=>{
      section3fPage.verifyQuestion8();
})

And('verify data is entered for question 9',()=>{
      section3fPage.verifyQuestion9();
})

And('verify data is entered for question 10',()=>{
      section3fPage.verifyQuestion10();
})

And('verify data is entered for question 11',()=>{
      section3fPage.verifyQuestion11();
})

And('verify data is entered for question 12',()=>{
      section3fPage.verifyQuestion12();
})

And('verify data is entered for question 13',()=>{
      section3fPage.verifyQuestion13();
})

And('verify Medicaid and CHIP combined is selected for question 14',()=>{
      section3fPage.verifyQuestion14();
})

And('verify selected Yes for question 15',()=>{
      section3fPage.verifyQuestion15();
})

And('verify text is entered in question 15a',()=>{
      section3fPage.verifyQuestion15a();
})

And('verify selected No for question 16',()=>{
      section3fPage.verifyQuestion16();
})

And('verify text is entered in question 17',()=>{
     section3fPage.verifyQuestion17();
})

And('verify Choose Files button is presented in question 18',()=>{
     section3fPage.verifyChooseFileButton();
})

And('verify Hide Uploaded button is presented in question 18',()=>{
      section3fPage.verifyhideUploadButton();
})

And('verify Next button is presented',()=>{
      section3fPage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section3fPage.verifyPreviousButton();
})

And('user clicks on the Basic State Information link',()=>{
   landingPage.clickBasicStateInfoTab();
})

And('user sees report edit page',()=>{
    landingPage.verifyReportPageVisibility();
})

When('user clicks on the Section 3G: Dental Benefits',()=>{
     section3gPage.clickSection3Link();
})

Then('user sees the Dental Benefits title',()=>{
     section3gPage.verifySection3title();
})

And('verify selected Yes for question 1',()=>{
     section3gPage.verifyQuestion1();
})

And('verify data is entered for question 2',()=>{
     section3gPage.verifyQuestion2();
})

And('verify data is entered for question 3',()=>{
     section3gPage.verifyQuestion3();
})

And('verify data is entered for question 4',()=>{
     section3gPage.verifyQuestion4();
})

And('verify data is entered for question 5',()=>{
     section3gPage.verifyQuestion5();
})

And('verify data is entered for question 6',()=>{
     section3gPage.verifyQuestion6();
})

And('verify selected No for question 7',()=>{
     section3gPage.verifyQuestion7();
})

And('verify text is entered in question 8',()=>{
      section3gPage.verifyQuestion8();
})

And('verify Choose Files button is presented in question 9',()=>{
      section3gPage.verifyQuestion9_1();
})

And('verify Hide Uploaded button is presented in question 9',()=>{
      section3gPage.verifyQuestion9_2();
})

And('verify Next button is presented',()=>{
      section3gPage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section3gPage.verifyPreviousButton();
})

When('user clicks on the Section 3H: CAHPS Survey Results',()=>{
      section3hPage.clickSection3hLink();
})

Then('user sees the CAHPS Survey Results title',()=>{
      section3hPage.verifySection3hTitle();
})

And('verify selected Yes for Part1 question 1',()=>{
      section3hPage.verifyQuestion1();
})

And('verify selected Yes for Part1 question 1a',()=>{
      section3hPage.verifyQuestion1a();
})

And('verify Choose Files button is presented in Part2 question 1',()=>{
      section3hPage.verifyChooseFile();
})

And('verify Hide Uploaded button is presented in Part2 question 2',()=>{
      section3hPage.verifyHideUpload();
})

And('erify Separate CHIP is selected for Part2 question 2',()=>{
      section3hPage.verifyQuestion2();
})

And('verify CAHPS 5.0H is selected for Part2 question 3',()=>{
      section3hPage.verifyQuestion3();
})

And('verify Children with Chronic Conditions is selected for Part2 question 4',()=>{
      section3hPage.verifyQuestion4();
})

And('verify NCQA HEDIS CAHPS 5.0H is selected for Part2 question 5',()=>{
      section3hPage.verifyQuestion5();
})

And('verify text is entered for Part2 question 6',()=>{
      section3hPage.verifyQuestion6();
})

And('verify Next button is presented',()=>{
      section3hPage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section3hPage.verifyPreviousButton();
})

When('user clicks on the Section 6: Challenges and Accomplishments',()=>{
      section6Page.clickSection6();
})

Then('user sees the Challenges and Accomplishments title',()=>{
      section6Page.verifySection6Title();
})

And('verify text in question 1',()=>{
      section6Page.verifyOption1();
})

And('verify text in question 2',()=>{
      section6Page.verifyOption2();
})

And('verify text in question 3',()=>{
      section6Page.verifyOption3();
})

And('verify text in question 4',()=>{
      section6Page.verifyOption4();
})

And('verify text in question 5',()=>{
      section6Page.verifyOption5();
})

And('verify Choose Files button is presented in question 6',()=>{
      section6Page.verifyOption6ChooseFile();
})

And('verify Hide Uploaded button is presented in question 6',()=>{
      section6Page.verifyOption6HideUpload();
})

And('verify Next button is presented',()=>{
      section6Page.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section6Page.verifyPreviousButton();
})

When('user clicks on the Section 3I: Health Services Initiative (HSI) Programs',()=>{
      section3iPage.clickSection3iLink();
})

Then('user sees the Health Services Initiative (HSI) Programs title',()=>{
      section3iPage.verifySection3iTitle();
})

And('verify Part1 question 1',()=>{
      section3iPage.verifyPart1Question1();
})

And('verify the information in Part2',()=>{
      section3iPage.verifyPart2Question1();
      section3iPage.verifyPart2Question2();
      section3iPage.verifyPart2Question3();
      section3iPage.verifyPart2Question4();
      section3iPage.verifyPart2Question5();
      section3iPage.verifyPart2Question6();
      section3iPage.verifyPart2Question7();
      section3iPage.verifyPart2Question8();
      section3iPage.verifyPart2Question9ChooseFile();
      section3iPage.verifyPart2Question9HideUpload();
      section3iPage.verifyPart2Question9AddAnother();
})

And('verify Next button is presented',()=>{
      section3iPage.verifyPreviousButton();
})

And('verify Previous button is presented',()=>{
      section3iPage.verifyNextButton();
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
      section3dPage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section3dPage.verifyPreviousButton();
})

When('user clicks on the Section 3E: Employer Sponsored Insurance and Premium Assistance',()=>{
      section3ePage.clickSection3ELink();
})

Then('user sees the Employer Sponsored Insurance and Premium Assistance title',()=>{
      section3ePage.verifySection3Etitle();
})

And('verify selected No for Part1 question 1',()=>{
      section3ePage.verifyPart1();
})

And('verify information in Part2',()=>{
      section3ePage.verifyPart2Text();
})

And('erify Next button is presented',()=>{
      section3ePage.verifyNextButton();
})

And('verify Previous button is presented',()=>{
      section3ePage.verifyPreviousButton();
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
