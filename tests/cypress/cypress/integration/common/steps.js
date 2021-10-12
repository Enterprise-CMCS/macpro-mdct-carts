import { Given, When, Then, And } from "cypress-cucumber-preprocessor/steps";

//import BasicStateInformationpage from '../../../support/pages/BasicStateInformationpage';
import Homepage from "../../../support/pages/Homepage";
import Landingpage from "../../../support/pages/Landingpage";
import LoginPage from "../../../support/pages/LoginPage";

// Page object declaration
//const basicStateInfoPage = new BasicStateInformationpage();
const homePage = new Homepage();
const landingPage = new Landingpage();
const loginPage = new LoginPage();

Given("user visits Carts home page", () => {
  landingPage.launch();
});

And("logins with valid username and password", () => {
  loginPage.enterUserName();
  loginPage.enterPassword();
  loginPage.clickAgreeTermAndConditions();
  loginPage.clickSignIn();
  cy.wait(5000);
});

And("user can see Carts landing page", () => {
  landingPage.validateLandingPageTitle();
});

Given("user sees the 2020 report", () => {
  landingPage.validateReport();
});
