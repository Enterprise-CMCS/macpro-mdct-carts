//const all_radio_button = "//label[contains(@for, 'radio')]";
const section1_prgramFee =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section1_title = "(//h2)[2]";
const radio_button1 = "(//label[contains(@for, 'radio')])[2]";
const radio_button2 = "(//label[contains(@for, 'radio')])[4]";
const radio_button3 = "(//label[contains(@for, 'radio')])[6]";
const text_input3b = "//input[@id='textfield_306']";
const text_area4 = "(//textarea[@class='ds-c-field'])[1]";
const checkbox5 = "(//label[contains(@for, 'checkbox')])[2]";
const text_area6 = "(//textarea[@class='ds-c-field'])[2]";
const radio_buttonPartTwo1 = "(//label[contains(@for, 'radio')])[8]";
const radio_buttonPartTwo2 = "(//label[contains(@for, 'radio')])[9]";
const radio_buttonPartTwo2a = "(//label[contains(@for, 'radio')])[10]";
const data_enterPartTwo2bFPL1 = "//input[@id='2020-01-a-02-02-b-0-0-0']";
const data_enterPartTwo2bFPL2 = "//input[@id='2020-01-a-02-02-b-0-0-1']";
const data_enterPartTwo2bPremium1 = "//input[@id='2020-01-a-02-02-b-0-1-0']";
const data_enterPartTwo2bPremium2 = "//input[@id='2020-01-a-02-02-b-0-1-1']";
const add_anotherButton1 =
  "(//button[@class='ds-c-button ds-c-button--primary'])[1]";
const radio_buttonPartTwo3 = "(//label[contains(@for, 'radio')])[13]";
const data_enterPartTwo3aFPL1 = "//input[@id='2020-01-a-02-03-a-0-0-0']";
const data_enterPartTwo3aFPL2 = "//input[@id='2020-01-a-02-03-a-0-0-1']";
const data_enterPartTwo3aPremium1 = "//input[@id='2020-01-a-02-03-a-0-1-0']";
const data_enterPartTwo3aPremium2 = "//input[@id='2020-01-a-02-03-a-0-1-1']";
const add_anotherButton2 =
  "(//button[@class='ds-c-button ds-c-button--primary'])[2]";
const text_areaPartTwo4 = "(//textarea[@class='ds-c-field'])[3]";
const checkboxPartTwo5 = "(//label[contains(@for, 'checkbox')])[6]";
const text_areaPartTwo6 = "(//textarea[@class='ds-c-field'])[4]";
const radio_buttonPartThree1 = "(//label[contains(@for, 'radio')])[16]";
const radio_buttonPartThree2 = "(//label[contains(@for, 'radio')])[17]";
const radio_buttonPartThree3 = "(//label[contains(@for, 'radio')])[20]";
const radio_buttonPartThree4 = "(//label[contains(@for, 'radio')])[22]";
const radio_buttonPartThree5 = "(//label[contains(@for, 'radio')])[24]";
const radio_buttonPartThree6 = "(//label[contains(@for, 'radio')])[26]";
const radio_buttonPartThree7 = "(//label[contains(@for, 'radio')])[28]";
const radio_buttonPartThree8 = "(//label[contains(@for, 'radio')])[30]";
const radio_buttonPartThree9 = "(//label[contains(@for, 'radio')])[32]";
const radio_buttonPartThree10 = "(//label[contains(@for, 'radio')])[34]";
const radio_buttonPartThree11 = "(//label[contains(@for, 'radio')])[36]";
const radio_buttonPartThree12 = "(//label[contains(@for, 'radio')])[38]";
const radio_buttonPartThree13 = "(//label[contains(@for, 'radio')])[40]";
const radio_buttonPartThree14 = "(//label[contains(@for, 'radio')])[42]";
const radio_buttonPartThree15 = "(//label[contains(@for, 'radio')])[44]";
const radio_buttonPartThree16 = "(//label[contains(@for, 'radio')])[46]";
const text_areaPartThree17 = "(//textarea[@class='ds-c-field'])[5]";
const radio_buttonPartThree18 = "(//label[contains(@for, 'radio')])[47]";
const radio_buttonPartFour1 = "(//label[contains(@for, 'radio')])[50]";
const radio_buttonPartFour2 = "(//label[contains(@for, 'radio')])[51]";
const radio_buttonPartFour3 = "(//label[contains(@for, 'radio')])[54]";
const radio_buttonPartFour4 = "(//label[contains(@for, 'radio')])[56]";
const radio_buttonPartFour5 = "(//label[contains(@for, 'radio')])[58]";
const radio_buttonPartFour6 = "(//label[contains(@for, 'radio')])[59]";
const radio_buttonPartFour7 = "(//label[contains(@for, 'radio')])[62]";
const radio_buttonPartFour8 = "(//label[contains(@for, 'radio')])[63]";
const radio_buttonPartFour9 = "(//label[contains(@for, 'radio')])[66]";
const radio_buttonPartFour10 = "(//label[contains(@for, 'radio')])[68]";
const radio_buttonPartFour11 = "(//label[contains(@for, 'radio')])[70]";
const radio_buttonPartFour12 = "(//label[contains(@for, 'radio')])[72]";
const radio_buttonPartFour13 = "(//label[contains(@for, 'radio')])[74]";
const radio_buttonPartFour14 = "(//label[contains(@for, 'radio')])[76]";
const radio_buttonPartFour15 = "(//label[contains(@for, 'radio')])[77]";
const radio_buttonPartFour16 = "(//label[contains(@for, 'radio')])[80]";
const radio_buttonPartFour17 = "(//label[contains(@for, 'radio')])[82]";
const radio_buttonPartFour18 = "(//label[contains(@for, 'radio')])[84]";
const radio_buttonPartFour19 = "(//label[contains(@for, 'radio')])[86]";
const text_areaPartFour20 = "(//textarea[@class='ds-c-field'])[6]";
const radio_buttonPartFour21 = "(//label[contains(@for, 'radio')])[87]";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";

//const all_textarea = "//textarea[@class='ds-c-field']";
//const all_checkbox_button = "//label[contains(@for, 'checkbox')]";

export class Section1page {
  clickOnSection1() {
    cy.xpath(section1_prgramFee).click();
  }

  verifytheTitle() {
    cy.xpath(section1_title).should("be.visible");
  }

  verifyInformationPart1() {
    cy.xpath(radio_button1).should("be.checked");
    cy.xpath(radio_button2).should("be.checked");
    cy.xpath(radio_button3).scrollIntoView();
    cy.xpath(radio_button3).should("be.checked");
    cy.xpath(text_input3b).scrollIntoView();
    cy.xpath(text_input3b).should("be.visible");
    cy.xpath(text_area4).scrollIntoView();
    cy.xpath(text_area4).should("be.visible");
    cy.xpath(checkbox5).scrollIntoView();
    cy.xpath(checkbox5).should("be.checked");
    cy.xpath(text_area6).scrollIntoView();
    cy.xpath(text_area6).should("be.visible");
  }

  verifyInformationPart2() {
    cy.xpath(radio_buttonPartTwo1).scrollIntoView();
    cy.xpath(radio_buttonPartTwo1).should("be.checked");
    cy.xpath(radio_buttonPartTwo2).scrollIntoView();
    cy.xpath(radio_buttonPartTwo2).should("be.checked");
    cy.xpath(radio_buttonPartTwo2a).scrollIntoView();
    cy.xpath(radio_buttonPartTwo2a).should("be.checked");
    cy.xpath(data_enterPartTwo2bFPL1).scrollIntoView();
    cy.xpath(data_enterPartTwo2bFPL1).should("be.visible");
    cy.xpath(data_enterPartTwo2bFPL2).should("be.visible");
    cy.xpath(data_enterPartTwo2bPremium1).should("be.visible");
    cy.xpath(data_enterPartTwo2bPremium2).should("be.visible");
    cy.xpath(add_anotherButton1).scrollIntoView();
    cy.xpath(add_anotherButton1).should("be.visible");
    cy.xpath(radio_buttonPartTwo3).scrollIntoView();
    cy.xpath(radio_buttonPartTwo3).should("be.visible");
    cy.xpath(data_enterPartTwo3aFPL1).scrollIntoView();
    cy.xpath(data_enterPartTwo3aFPL1).should("be.visible");
    cy.xpath(data_enterPartTwo3aFPL2).should("be.visible");
    cy.xpath(data_enterPartTwo3aPremium1).should("be.visible");
    cy.xpath(data_enterPartTwo3aPremium2).should("be.visible");
    cy.xpath(add_anotherButton2).scrollIntoView();
    cy.xpath(text_areaPartTwo4).scrollIntoView();
    cy.xpath(text_areaPartTwo4).should("be.visible");
    cy.xpath(checkboxPartTwo5).scrollIntoView();
    cy.xpath(checkboxPartTwo5).should("be.checked");
    cy.xpath(text_areaPartTwo6).scrollIntoView();
    cy.xpath(text_areaPartTwo6).should("be.visible");
  }

  verifyInformationPart3() {
    cy.xpath(radio_buttonPartThree1).scrollIntoView();
    cy.xpath(radio_buttonPartThree1).should("be.checked");
    cy.xpath(radio_buttonPartThree2).scrollIntoView();
    cy.xpath(radio_buttonPartThree2).should("be.checked");
    cy.xpath(radio_buttonPartThree3).scrollIntoView();
    cy.xpath(radio_buttonPartThree3).should("be.checked");
    cy.xpath(radio_buttonPartThree4).scrollIntoView();
    cy.xpath(radio_buttonPartThree4).should("be.checked");
    cy.xpath(radio_buttonPartThree5).scrollIntoView();
    cy.xpath(radio_buttonPartThree5).should("be.checked");
    cy.xpath(radio_buttonPartThree6).scrollIntoView();
    cy.xpath(radio_buttonPartThree6).should("be.checked");
    cy.xpath(radio_buttonPartThree7).scrollIntoView();
    cy.xpath(radio_buttonPartThree7).should("be.checked");
    cy.xpath(radio_buttonPartThree8).scrollIntoView();
    cy.xpath(radio_buttonPartThree8).should("be.checked");
    cy.xpath(radio_buttonPartThree9).scrollIntoView();
    cy.xpath(radio_buttonPartThree9).should("be.checked");
    cy.xpath(radio_buttonPartThree10).scrollIntoView();
    cy.xpath(radio_buttonPartThree10).should("be.checked");
    cy.xpath(radio_buttonPartThree11).scrollIntoView();
    cy.xpath(radio_buttonPartThree11).should("be.checked");
    cy.xpath(radio_buttonPartThree12).scrollIntoView();
    cy.xpath(radio_buttonPartThree12).should("be.checked");
    cy.xpath(radio_buttonPartThree13).scrollIntoView();
    cy.xpath(radio_buttonPartThree13).should("be.checked");
    cy.xpath(radio_buttonPartThree14).scrollIntoView();
    cy.xpath(radio_buttonPartThree14).should("be.checked");
    cy.xpath(radio_buttonPartThree15).scrollIntoView();
    cy.xpath(radio_buttonPartThree15).should("be.checked");
    cy.xpath(radio_buttonPartThree16).scrollIntoView();
    cy.xpath(radio_buttonPartThree16).should("be.checked");
    cy.xpath(text_areaPartThree17).scrollIntoView();
    cy.xpath(text_areaPartThree17).should("be.visible");
    cy.xpath(radio_buttonPartThree18).scrollIntoView();
    cy.xpath(radio_buttonPartThree18).should("be.checked");
  }

  verifyInformationPart4() {
    cy.xpath(radio_buttonPartFour1).scrollIntoView();
    cy.xpath(radio_buttonPartFour1).should("be.checked");
    cy.xpath(radio_buttonPartFour2).scrollIntoView();
    cy.xpath(radio_buttonPartFour2).should("be.checked");
    cy.xpath(radio_buttonPartFour3).scrollIntoView();
    cy.xpath(radio_buttonPartFour3).should("be.checked");
    cy.xpath(radio_buttonPartFour4).scrollIntoView();
    cy.xpath(radio_buttonPartFour4).should("be.checked");
    cy.xpath(radio_buttonPartFour5).scrollIntoView();
    cy.xpath(radio_buttonPartFour5).should("be.checked");
    cy.xpath(radio_buttonPartFour6).scrollIntoView();
    cy.xpath(radio_buttonPartFour6).should("be.checked");
    cy.xpath(radio_buttonPartFour7).scrollIntoView();
    cy.xpath(radio_buttonPartFour7).should("be.checked");
    cy.xpath(radio_buttonPartFour8).scrollIntoView();
    cy.xpath(radio_buttonPartFour8).should("be.checked");
    cy.xpath(radio_buttonPartFour9).scrollIntoView();
    cy.xpath(radio_buttonPartFour9).should("be.checked");
    cy.xpath(radio_buttonPartFour10).scrollIntoView();
    cy.xpath(radio_buttonPartFour10).should("be.checked");
    cy.xpath(radio_buttonPartFour11).scrollIntoView();
    cy.xpath(radio_buttonPartFour11).should("be.checked");
    cy.xpath(radio_buttonPartFour12).scrollIntoView();
    cy.xpath(radio_buttonPartFour12).should("be.checked");
    cy.xpath(radio_buttonPartFour13).scrollIntoView();
    cy.xpath(radio_buttonPartFour13).should("be.checked");
    cy.xpath(radio_buttonPartFour14).scrollIntoView();
    cy.xpath(radio_buttonPartFour14).should("be.checked");
    cy.xpath(radio_buttonPartFour15).scrollIntoView();
    cy.xpath(radio_buttonPartFour15).should("be.checked");
    cy.xpath(radio_buttonPartFour16).scrollIntoView();
    cy.xpath(radio_buttonPartFour16).should("be.checked");
    cy.xpath(radio_buttonPartFour17).scrollIntoView();
    cy.xpath(radio_buttonPartFour17).should("be.checked");
    cy.xpath(radio_buttonPartFour18).scrollIntoView();
    cy.xpath(radio_buttonPartFour18).should("be.checked");
    cy.xpath(radio_buttonPartFour19).scrollIntoView();
    cy.xpath(radio_buttonPartFour19).should("be.checked");
    cy.xpath(text_areaPartFour20).scrollIntoView();
    cy.xpath(text_areaPartFour20).should("be.visible");
    cy.xpath(radio_buttonPartFour21).scrollIntoView();
    cy.xpath(radio_buttonPartFour21).should("be.checked");
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
export default Section1page;
