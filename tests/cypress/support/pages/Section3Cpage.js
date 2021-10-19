//const all_input_texts = "//input[@type='text']";          // 149
const all_disabled_input_text = "//input[@type='text' and @disabled]"; // disabled input 140
const all_enabled_input_text = "//input[@type='text' and not(@disabled)]"; // enabled input  9
const all_textarea = "//textarea[@class='ds-c-field']"; // all textarea 11
const all_table = "//table"; // all table elements 5
const all_radio_button_lable = "//label[contains(@for, 'radio')]"; // all radio button label 15
const section3cLink = "//li/a[contains(text(), 'Section 3C')]";
const section3CpageBanner = "//h2[ contains(text(), 'Renewal')]";

export class Section3Cpage {
  clickSectionCfLink() {
    cy.xpath(section3cLink).click();
  }

  verifySection3CTitle() {
    cy.xpath(section3CpageBanner).should("be.visible");
  }

  // verifyAllTextInputs()
  // {
  //     cy.xpath(all_input_texts).each((item, index, list) => {
  //         expect(list).to.have.length(149);      // number of element item
  //         cy.wrap(item).should('be.visible');  // checking for visibility
  //     })
  // }

  verifyAllDisabledTextInputs() {
    cy.xpath(all_disabled_input_text).each((item, index, list) => {
      expect(list).to.have.length(140); // number of element item
      cy.wrap(item).should("be.visible"); // checking for visibility
    });
  }

  verifyAllEnabledTextInputs() {
    cy.xpath(all_enabled_input_text).each((item, index, list) => {
      expect(list).to.have.length(9); // number of element item
      cy.wrap(item).should("be.visible"); // checking for visibility
    });
  }

  verifyAllTextareas() {
    cy.xpath(all_textarea).each((item, index, list) => {
      expect(list).to.have.length(11); // number of element item
      cy.wrap(item).should("be.visible"); // checking for visibility
    });
  }

  verifyAllTables() {
    cy.xpath(all_table).each((item, index, list) => {
      expect(list).to.have.length(5); // number of element item
      cy.wrap(item).should("be.visible"); // checking for visibility
    });
  }

  verifyAllRadioBttnLables() {
    cy.xpath(all_radio_button_lable).each((item, index, list) => {
      expect(list).to.have.length(15); // number of element item
      cy.wrap(item).should("be.visible"); // checking for visibility
    });
  }
}
export default Section3Cpage;
