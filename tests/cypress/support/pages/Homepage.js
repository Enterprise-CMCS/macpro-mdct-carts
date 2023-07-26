const appLogo = "a[contains(text(), 'CARTS')]";
const headerAppLogo = "a[contains(text(), 'CARTS')]";
const headerLoginButton = "a#loginButton";
const footerAddress = '(//div[@class="footer-wrapper"]/div)[2]';
const footerEmail = ".footer-email";
const footerHhsLogo = "img[alt='Department of Health and Human Services logo']";
const footerMdctLogo = "img[@alt='Mdct logo']";
const footerMedicaidLogo = "img[@alt='Medicaid.gov logo']";
const medicaidLogo = "img[alt='Medicaid.gov logo']";
const footerSentence = '(div[@class="footer-fed-gov-text"])[1]';

export class Homepage {
  launch() {
    cy.visit("/");
  }

  verifyLogos() {
    cy.get(appLogo).should("be.visible");
    cy.get(footerMdctLogo).should("be.visible");
    cy.get(footerMedicaidLogo).should("be.visible");
  }

  validateCoreSetReportingIcon() {
    cy.get(headerAppLogo).should("be.visible");
  }

  validatePageBanner() {
    cy.get(headerAppLogo).should("be.visible");
  }

  validateLoginButton() {
    cy.get(headerLoginButton).should("be.visible");
  }

  clickLoginButton() {
    cy.get(headerLoginButton).click();
  }

  validateSupportSenence() {
    cy.get(footerSentence).should("be.visible");
  }

  validateMedicaidLogo() {
    cy.get(medicaidLogo).should("be.visible");
  }

  validateEmail() {
    cy.get(footerEmail).contains("MDCT_Help@cms.hhs.gov");
  }

  validateFederalLogo() {
    cy.get(footerHhsLogo).should("be.visible");
  }

  validateAddress() {
    cy.get(footerAddress).contains(
      "7500 Security Boulevard Baltimore, MD 21244"
    );
  }
}
export default Homepage;
