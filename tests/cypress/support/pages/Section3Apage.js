const option1_yes =
  "//div[@class='main']/div[2]/div/div[1]/fieldset[@class='ds-c-fieldset']/div[1]/label[@class='ds-c-label']";
const option1_1a = "textarea[name='2020-03-a-01-01-a']";
const option1_no =
  "//div[@class='main']/div[2]/div/div[1]/fieldset[@class='ds-c-fieldset']/div[2]/label[@class='ds-c-label']";

const option2_yes =
  "//div/div[2]/fieldset[@class='ds-c-fieldset']/div[1]/label[@class='ds-c-label']";
const option2_2a = "textarea[name='2020-03-a-01-02-a']";
const option2_no =
  "//div/div[2]/fieldset[@class='ds-c-fieldset']/div[2]/label[@class='ds-c-label']";

const option3 = "textarea[name='2020-03-a-01-03']";
const option4 = "textarea[name='2020-03-a-01-04']";
const file_upload = "[type='file']";
const hideUpload_button =
  "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const section3Title = "(//h2)[3]";
const section3aLink =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";

export class Section3Apage {
  clickOnSection3a() {
    cy.xpath(section3aLink).click();
  }

  verifytheTitle() {
    cy.xpath(section3Title).should("be.visible");
  }

  verifyQuestion1() {
    cy.get(option1_no).should("be.checked");
  }

  verifyQuestion2() {
    cy.get(option2_no).should("be.checked");
  }

  verifyQuestion3() {
    cy.get(option3).should("be.visible");
  }

  verifyQuestion4() {
    cy.get(option4).should("be.visible");
  }

  verifyChooseFileButton() {
    cy.xpath(file_upload).should("be.visible");
  }

  verifyhideUploadButton() {
    cy.xpath(hideUpload_button).should("be.visible");
  }

  verifyPreviousButton() {
    cy.xpath(button_previous).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(button_next).should("be.visible");
  }
}
export default Section3Apage;
