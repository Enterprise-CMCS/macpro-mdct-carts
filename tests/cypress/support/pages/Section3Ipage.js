const all_radio_button = "//label[contains(@for, 'radio')]";
const all_input_texts = "//input[@type='text']";
const all_textarea = "//textarea";
const file_upload = "[type='file']";
const add_another_bttn = ".add-objective";
const another_in_list_banner = ".question-inner-header";
const delete_last_item = ".ds-c-button--danger";

const section3iLink =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section3iTitle = "(//h2)[3]";
const part1question1 = "(//label[@class='ds-c-label'])[1]";
const part2question1 = "//input[@id='textfield_30']";
const part2question2 = "(//label[@class='ds-c-label'])[4]";
const part2question3 = "//textarea[@id='textfield_34']";
const part2question4 = "//input[@id='textfield_36']";
const part2question5 = "//input[@id='textfield_38']";
const part2question6 = "//textarea[@id='textfield_40']";
const part2question7 = "//textarea[@id='textfield_42']";
const part2question8 = "//textarea[@id='textfield_44']";
const question9ChooseFile = "//input[@id='textfield_46']";
const question9HideUpload =
  "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const addAnotherButton =
  "//button[@class='add-objective ds-c-button ds-c-button--primary']";
const previousButton = "//button[@class='ds-c-button ds-c-button']";
const nextButton =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";

export class Section3Ipage {
  clickSection3iLink() {
    cy.xpath(section3iLink).click();
  }

  verifySection3iTitle() {
    cy.xpath(section3iTitle).should("be.visible");
  }

  verifyPart1Question1() {
    cy.xpath(part1question1).should("be.checked");
  }

  verifyPart2Question1() {
    cy.xpath(part2question1).should("be.visible");
  }

  verifyPart2Question2() {
    cy.xpath(part2question2).should("be.checked");
  }

  verifyPart2Question3() {
    cy.xpath(part2question3).should("be.visible");
  }

  verifyPart2Question4() {
    cy.xpath(part2question4).should("be.visible");
  }

  verifyPart2Question5() {
    cy.xpath(part2question5).should("be.visible");
  }

  verifyPart2Question6() {
    cy.xpath(part2question6).should("be.visible");
  }

  verifyPart2Question7() {
    cy.xpath(part2question7).should("be.visible");
  }

  verifyPart2Question8() {
    cy.xpath(part2question8).should("be.visible");
  }

  verifyPart2Question9ChooseFile() {
    cy.xpath(question9ChooseFile).should("be.visible");
  }

  verifyPart2Question9HideUpload() {
    cy.xpath(question9HideUpload).should("be.visible");
  }

  verifyPart2Question9AddAnother() {
    cy.xpath(addAnotherButton).should("be.visible");
  }

  verifyPreviousButton() {
    cy.xpath(previousButton).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(nextButton).should("be.visible");
  }
}
export default Section3Ipage;
