const program_integrity = ".main div:nth-child(4) .screen-only";
const section3fLink = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const question1 = "(//label[@class='ds-c-label'])[1]";
const question2 = "(//label[@class='ds-c-label'])[3]";
const question3 = "(//label[@class='ds-c-label'])[5]";
const question4 = "//textarea[@id='textfield_199']";
const question5 = "(//label[@class='ds-c-label'])[10]";
const question6 = "//input[@id='textfield_204']";
const question7 = "//input[@id='textfield_206']";
const question8 = "//input[@id='textfield_208']";
const question9 = "//input[@id='textfield_210']";
const question10 = "//input[@id='textfield_212']";
const question11 = "//input[@id='textfield_214']";
const question12= "//input[@id='textfield_216']";
const question13= "//input[@id='textfield_218']";
const question14= "(//label[@class='ds-c-label'])[19]";
const question15 = "(//label[@class='ds-c-label'])[21]";
const question15a = "//textarea[@id='textfield_223']";
const question16= "(//label[@class='ds-c-label'])[26]";
const question17= "//textarea[@id='textfield_228']";
const question18= "//input[@id='textfield_230']";
const question18button = "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const button_previous = "//button[@class='ds-c-button ds-c-button']";
const button_next = "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";

export class Section3Fpage {
    clickSection3fLink(){
        cy.xpath(section3fLink).click();
    }

    verifySection3title(){
        cy.get(program_integrity).should('be.visible');
    }

    verifyQuestion1(){
        cy.xpath(question1).should('be.checked');
    }

    verifyQuestion2(){
        cy.xpath(question2).should('be.checked');
    }

    verifyQuestion3(){
        cy.xpath(question3).should('be.checked');
    }

    verifyQuestion4(){
        cy.xpath(question4).should('be.visible');
    }

    verifyQuestion5(){
        cy.xpath(question5).should('be.checked');
    }

    verifyQuestion6(){
        cy.xpath(question6).should('be.visible');
    }

    verifyQuestion7(){
        cy.xpath(question7).should('be.visible');
    }

    verifyQuestion8(){
        cy.xpath(question8).should('be.visible');
    }

    verifyQuestion9(){
        cy.xpath(question9).should('be.visible');
    }

    verifyQuestion10(){
        cy.xpath(question10).should('be.visible');
    }

    verifyQuestion11(){
        cy.xpath(question11).should('be.visible');
    }

    verifyQuestion12(){
        cy.xpath(question12).should('be.visible');
    }

    verifyQuestion13(){
        cy.xpath(question13).should('be.visible');
    }

    verifyQuestion14(){
        cy.xpath(question14).should('be.checked');
    }

    verifyQuestion15(){
        cy.xpath(question15).should('be.checked');
    }

    verifyQuestion15a(){
        cy.xpath(question15a).should('be.visible');
    }

    verifyQuestion16(){
        cy.xpath(question16).should('be.checked');
    }

    verifyQuestion17(){
        cy.xpath(question17).should('be.visible');
    }

    verifyChooseFileBUtton(){
        cy.xpath(question18).should('be.visible');
    }

    verifyHideUploadButton(){
        cy.xpath(question18button).should('be.visible');
    }

    verifyPreviousButton(){
        cy.xpath(button_previous).should('be.visible');
    }

    verifyNextButton(){
        cy.xpath(button_next).should('be.visible');
    }


}
export default Section3Fpage;