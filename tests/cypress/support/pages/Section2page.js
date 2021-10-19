//=== List of elements user interacts in this page ====//
const programs_table = ".main div:nth-child(2) .question:nth-child(2)";
const enrollement_numbers_txtbox = "textarea[name='2020-02-a-01-01']";
const num_uninsured_child_table =
  ".main .question:nth-child(2) [class='ds-c-table ds-u-margin-top--2']";
const percent_change = "synthesized-table-1"; //need to check
const reason_num_uninsured_child_changed =
  ".main .question:nth-child(4) [rows]";

// Option 2
const option_2_yes = "(//label[@class='ds-c-label'])[3]";
const option_2a_textbox = ".ds-c-choice__checkedChild [rows]";
//const option_2a_no = "[for='radio_2020-02-a-02-02_33']";

// Option 3
const option_3_no = "(//label[@class='ds-c-label'])[7]";
//const textbox_3a = "textarea[name='2020-02-a-02-03-a']";
//const start_day = ".date-range-start-wrapper";
//private final By end_day = css(".date-range > .date-range-end-wrapper");
// const textbox_3c = "textarea[name='2020-02-a-02-03-c']";
// const textbox_3d = "textarea[name='2020-02-a-02-03-d']";
// const textbox_3e = "textarea[name='2020-02-a-02-03-e']";
// const textbox_3f = "textarea[name='2020-02-a-02-03-f']";
// const textbox_3g = "textarea[name='2020-02-a-02-03-g']";
// const textbox_3h = "textarea[name='2020-02-a-02-03-h']";
//const option_3_no = "[for='radio_2020-02-a-02-03_35']";

const textbox_4 = "textarea[name='2020-02-a-02-04']";
const file_upload = "[type='file']";
const hideUpload_button =
  "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";

const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const section2_Enrollment =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section2_title = "(//h2)[2]";

export class Section2page {
  clickOnSection2() {
    cy.xpath(section2_Enrollment).click();
  }

  verifytheSection2Title() {
    cy.xpath(section2_title).should("be.visible");
  }

  verifyInformationPart1() {
    cy.get(programs_table).scrollIntoView();
    cy.get(programs_table).should("be.visible");
    cy.get(enrollement_numbers_txtbox).scrollIntoView();
    cy.get(enrollement_numbers_txtbox).should("be.visible");
  }

  verifyInformationPart2() {
    cy.get(num_uninsured_child_table).scrollIntoView();
    cy.get(num_uninsured_child_table).should("be.visible");
    cy.get(percent_change).scrollIntoView();
    cy.get(percent_change).should("be.visible");
    cy.get(reason_num_uninsured_child_changed).scrollIntoView();
    cy.get(reason_num_uninsured_child_changed).should("be.visible");
    cy.xpath(option_2_yes).scrollIntoView();
    cy.xpath(option_2_yes).should("be.checked");
    cy.get(option_2a_textbox).scrollIntoView();
    cy.get(option_2a_textbox).should("be.visible");
    cy.xpath(option_3_no).scrollIntoView();
    cy.xpath(option_3_no).should("be.checked");
    cy.get(textbox_4).scrollIntoView();
    cy.get(textbox_4).should("be.visible");
    cy.get(file_upload).scrollIntoView();
    cy.get(file_upload).should("be.visible");
    cy.get(hideUpload_button).scrollIntoView();
    cy.get(hideUpload_button).should("be.visible");
  }

  verifyPreviousButton() {
    cy.xpath(button_previous).scrollIntoView();
    cy.xpath(button_previous).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(button_next).scrollIntoView();
    cy.xpath(button_next).should("be.visible");
  }
}
export default Section2page;
