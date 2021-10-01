

const logoAtTopLeft = 'img[alt="QMR Logo"]';
const myAccountButton = 'a#User';
const yourAPSSubmissionsTxt = "//h1";
const sentence = '.home-footer-container > div > div:nth-of-type(1)';
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const emailBottomLeft = '.footer-email';
const federalLogo = "img[alt='Department of Health and Human Services logo']";
const addressBottomRight = '.footer-bottom-container > div > div:nth-of-type(2)';
const reportRow = '.ds-l-row.report-header';
const editLink = "//a[text()='Edit']";
const reportEditPageBanner = '//h1';
const pageBanner = "//h1[text()='CHIP Annual Report Template System (CARTS)']";

export class Landingpage {


    launch() 
    {
        cy.visit('https://mdctcartsdev.cms.gov/');
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
        cy.get(reportRow).should('be.visible');
    }

    clickEditLink()
    {
        cy.xpath(editLink).click();
    }

    verifyReportPageVisibility() {
        cy.xpath(reportEditPageBanner).contains('Connecticut');
    }
    
   
}
export default Landingpage;


    