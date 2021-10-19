const cost_sharing = ".main div:nth-child(4) .screen-only";
const cost_sharing_texts = ".helper-text";

const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next =
  "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const section3dLink =
  "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";

export class Section3Dpage {
  clickSection3D() {
    cy.xpath(section3dLink).click();
  }

  verify3dtitle() {
    cy.get(cost_sharing).should("be.visible");
  }

  verifyText() {
    cy.get(cost_sharing_texts).should("be.visible");
  }

  verifyPreviousButton() {
    cy.xpath(button_previous).should("be.visible");
  }

  verifyNextButton() {
    cy.xpath(button_next).should("be.visible");
  }
}
export default Section3Dpage;
