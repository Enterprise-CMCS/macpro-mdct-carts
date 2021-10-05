const logoAtTopLeft = 'img[alt="QMR Logo"]';
const loginButton = 'a#loginButton';
const apsSubmissionAppTxt = "//div[@class='Home']//h1[.='APS Submission App']";
const sentence = '.home-footer-container > div > div:nth-of-type(1)';
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const emailBottomLeft = '.footer-email';
const federalLogo = "img[alt='Department of Health and Human Services logo']";
const addressBottomRight = '.footer-bottom-container > div > div:nth-of-type(2)';


export class Homepage {


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
        cy.xpath(apsSubmissionAppTxt).should('be.visible');
    }

    validateLoginButton()
    {
        cy.get(loginButton).should('be.visible');
    }

    clickLoginButton()
    {
        cy.get(loginButton).click(); 
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
    
   
}
export default Homepage;