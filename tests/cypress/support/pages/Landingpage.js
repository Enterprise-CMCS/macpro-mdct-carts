

const logoAtTopLeft = 'img[alt="QMR Logo"]';
const myAccountButton = 'a#User';
const yourAPSSubmissionsTxt = "//h1";
const sentence = '.home-footer-container > div > div:nth-of-type(1)';
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const emailBottomLeft = '.footer-email';
const federalLogo = "img[alt='Department of Health and Human Services logo']";
const addressBottomRight = '.footer-bottom-container > div > div:nth-of-type(2)';
const reportRow2020 = "//div[text()='2020']";
const editLink = "//a[contains(@href, '2020')]";
const reportEditPageBanner = '//h1';
const pageBanner = "//h1[text()='CHIP Annual Report Template System (CARTS)']";

// tab section elements
const basicStateInfoTab = "//a[text()='Basic State Information']";
const section1Tab = '';

export class Landingpage {


    launch() 
    {
        cy.visit('https://mdctcartsdev.cms.gov/');
        cy.wait(5000);
    }

    validateCoreSetReportingIcon() 
    {
        cy.get(logoAtTopLeft).should('be.visible');
    }

    validatePageBanner()
    {
        cy.xpath(yourAPSSubmissionsTxt).should('be.visible');
    }

    validateMyAccountButton()
    {
        cy.get(myAccountButton).should('be.visible');
    }

    validateSupportSenence()
    {
        cy.get(sentence).should('be.visible');
    }

    validateMedicaidLogo()
    {
        cy.get(medicaidLogo).should('be.visible');
    }

    validateEmail() 
    {
        cy.get(emailBottomLeft).contains('MDCT_Help@cms.hhs.gov'); 
    }

    validateFederalLogo()
    {
        cy.get(federalLogo).should('be.visible');
    }

    validateAddress()
    {
        cy.get(addressBottomRight).contains('7500 Security Boulevard Baltimore, MD 21244'); 
    }

    validateLandingPageTitle()
    {
        cy.xpath(pageBanner).should('be.visible');
    }

    validateReport()
    {
        cy.reload();
        cy.xpath(reportRow2020).should('be.visible');
    }

    clickEditLink()
    {
        cy.xpath(editLink).click();
        cy.wait(3000);
    }

    verifyReportPageVisibility() {
        cy.xpath(reportEditPageBanner).contains('CARTS FY2020');
    }
    
    clickBasicStateInfoTab() 
    {
        cy.xpath(basicStateInfoTab).click();
    }

    clickSection1Tab()
    {

    }

    clickSection2Tab()
    {

    }

    clickSection3ATab() 
    {

    }
   
}
export default Landingpage;


    