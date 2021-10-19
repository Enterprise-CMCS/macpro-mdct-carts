// option 1
const option1_yes = "[for='radio_2020-03-b-01-01_28']";
const option1_1a = "textarea[name='2020-03-b-01-01-a']";
const option1_no = "(//label[@class='ds-c-label'])[2]";
const option1_na = "[for='radio_2020-03-b-01-01_30']";

// option2
const option2_yes = "[for='radio_2020-03-b-01-02_31']";
const option2_2a = "textarea[name='2020-03-b-01-02-a']";
const option2_no = "(//label[@class='ds-c-label'])[5]";
const option2_na = "[for='radio_2020-03-b-01-02_33']";

const option3_text = "input[name='2020-03-b-01-03']";

const option5_text = "textarea[name='2020-03-b-01-05']";

const option6_fileUpload = "[type='file']";
const hideUpload_button =
  "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const section3Title = "(//h2)[3]";
const section3bLink =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";

export class Section3Bpage {
  clickSection3BLink() {
    cy.xpath(section3bLink).click();
  }

  verifySection3Title() {
    cy.xpath(section3Title).should("be.visible");
  }

  verifyQuestion1() {
    cy.get(option1_no).should("be.checked");
  }

  verifyQuestion2() {
    cy.get(option2_no).should("be.checked");
  }

  verifyQuestion3() {
    cy.get(option3_text).should("be.visible");
  }

  verifyQuestion5() {
    cy.get(option5_text).should("be.visible");
  }

  verifyFileUploadButton() {
    cy.get(option6_fileUpload).should("be.visible");
  }

  verifyHideUploadButton() {
    cy.xpath(hideUpload_button).should("be.visible");
  }

  verifyPreviousButton() {
    cy.xpath(button_previous).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(button_next).should("be.visible");
  }
}
export default Section3Bpage;
