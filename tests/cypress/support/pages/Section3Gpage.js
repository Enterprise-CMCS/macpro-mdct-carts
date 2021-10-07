
const dental_benefit = ".main div:nth-child(4) .screen-only";
const section3gLink = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const question1 = "(//label[@class='ds-c-label'])[1]";
const question2_1 = "//input[@id='textfield_138']";
const question2_2 = "//input[@id='textfield_140']";
const question2_3 = "//input[@id='textfield_142']";
const question2_4 = "//input[@id='textfield_144']";
const question2_5 = "//input[@id='textfield_146']";
const question2_6 = "//input[@id='textfield_148']";

const question3_1 = "//input[@id='textfield_150']";
const question3_2 = "//input[@id='textfield_152']";
const question3_3 = "//input[@id='textfield_154']";
const question3_4 = "//input[@id='textfield_156']";
const question3_5 = "//input[@id='textfield_158']";
const question3_6 = "//input[@id='textfield_160']";

const question4_1 = "//input[@id='textfield_162']";
const question4_2 = "//input[@id='textfield_164']";
const question4_3 = "//input[@id='textfield_166']";
const question4_4 = "//input[@id='textfield_168']";
const question4_5 = "//input[@id='textfield_170']";
const question4_6 = "//input[@id='textfield_172']";


const question5_1 = "//input[@id='textfield_174']";
const question5_2 = "//input[@id='textfield_176']";
const question5_3 = "//input[@id='textfield_178']";
const question5_4 = "//input[@id='textfield_180']";
const question5_5 = "//input[@id='textfield_182']";
const question5_6 = "//input[@id='textfield_184']";

const question6 = "//input[@id='textfield_130']";
const question7 = "(//label[@class='ds-c-label'])[29]";
const question8 = "//textarea[@id='textfield_134']";
const question9_chooseFile = "//input[@id='textfield_136']";
const question9_hideUpload = "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next = "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";


export class Section3Gpage {

    clickSection3Link(){
        cy.xpath(section3gLink).click();
    }

    verifySection3title(){
        cy.get(dental_benefit).should('be.visible');
    }

    verifyQuestion1(){
        cy.xpath(question1).should('be.checked');
    }

    verifyQuestion2(){
        cy.xpath(question2_1).should('be.visible');
        cy.xpath(question2_2).should('be.visible');
        cy.xpath(question2_3).should('be.visible');
        cy.xpath(question2_4).should('be.visible');
        cy.xpath(question2_5).should('be.visible');
        cy.xpath(question2_6).should('be.visible');
    }

    verifyQuestion3(){
        cy.xpath(question3_1).should('be.visible');
        cy.xpath(question3_2).should('be.visible');
        cy.xpath(question3_3).should('be.visible');
        cy.xpath(question3_4).should('be.visible');
        cy.xpath(question3_5).should('be.visible');
        cy.xpath(question3_6).should('be.visible');
    }

    verifyQuestion4(){
        cy.xpath(question4_1).should('be.visible');
        cy.xpath(question4_2).should('be.visible');
        cy.xpath(question4_3).should('be.visible');
        cy.xpath(question4_4).should('be.visible');
        cy.xpath(question4_5).should('be.visible');
        cy.xpath(question4_6).should('be.visible');
    }

    verifyQuestion5(){
        cy.xpath(question5_1).should('be.visible');
        cy.xpath(question5_2).should('be.visible');
        cy.xpath(question5_3).should('be.visible');
        cy.xpath(question5_4).should('be.visible');
        cy.xpath(question5_5).should('be.visible');
        cy.xpath(question5_6).should('be.visible');
    }

    verifyQuestion6(){
        cy.xpath(question6).should('be.visible');
    }

    verifyQuestion7(){
        cy.xpath(question7).should('be.checked');
    }

    verifyQuestion8(){
        cy.xpath(question8).should('be.visible');
    }

    verifyQuestion9_1(){
        cy.xpath(question9_chooseFile).should('be.visible');
    }

    verifyQuestion9_2(){
        cy.xpath(question9_hideUpload).should('be.visible');
    }

    verifyNextButton(){
        cy.xpath(button_next).should('be.visible');
    }

    verifyPreviousButton(){
        cy.xpath(button_previous).should('be.visible');
    }


}
export default Section3Gpage;