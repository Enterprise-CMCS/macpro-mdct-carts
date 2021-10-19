const all_radio_button = "(//label[contains(@for, 'radio')])[2]";
//const all_checkbox_button = "//label[contains(@for, 'checkbox')]";
//const all_textarea = "//textarea";
const part2Text = "//div[@class='ds-c-alert__text']";
const file_upload = "[type='file']";
const text_inputs = "//input[@type='text']";

const section3Etitle =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section3ELink = "(//h2)[2]";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";

export class Section3Epage {
  clickSection3ELink() {
    cy.xpath(section3ELink).click();
  }

  verifySection3Etitle() {
    cy.xpath(section3Etitle).should("be.visible");
  }

  verifyPart1() {
    cy.xpath(all_radio_button).should("be.checked");
  }

  verifyPart2Text() {
    cy.xpath(part2Text).should("be.checked");
  }

  verifyPreviousButton() {
    cy.xpath(button_previous).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(button_next).should("be.visible");
  }
}
export default Section3Epage;
