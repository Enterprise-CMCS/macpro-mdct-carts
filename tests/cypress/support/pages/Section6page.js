const option1_text = "textarea[name='2020-06-a-01-01']";
const option2_text = "textarea[name='2020-06-a-01-02']";
const option3_text = "textarea[name='2020-06-a-01-03']";
const option4_text = "textarea[name='2020-06-a-01-04']";
const option5_text = "textarea[name='2020-06-a-01-05']";
const option6_file_upload = "input[name='2020-06-a-01-06']";
const question6_hideUpload = "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const previousButton = "//button[@class='ds-c-button ds-c-button']";
const nextButton = "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const section6Link = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section6Title = "(//h2)[2]";

export class Section6page {
    clickSection6(){
        cy.xpath(section6Link).click();
    }

    verifySection6Title(){
        cy.xpath(section6Title).should('be.visible');
    }

    verifyOption1(){
        cy.get(option1_text).should('be.visible');
    }

    verifyOption2(){
        cy.get(option2_text).should('be.visible');
    }

    verifyOption3(){
        cy.get(option3_text).should('be.visible');
    }

    verifyOption4(){
        cy.get(option4_text).should('be.visible');
    }

    verifyOption5(){
        cy.get(option5_text).should('be.visible');
    }

    verifyOption6ChooseFile(){
        cy.get(option6_file_upload).should('be.visible');
    }

    verifyOption6HideUpload(){
        cy.xpath(question6_hideUpload).should('be.visible');
    }

    verifyPreviousButton(){
        cy.xpath(previousButton).should('be.visible');
    }

    verifyNextButton(){
        cy.xpath(nextButton).should('be.visible');
    }



}
export default Section6page;