const file_upload = "[type='file']";
const all_radio_button = "//label[contains(@for, 'radio')]";
const all_checkboxes = "//label[contains(@for, 'checkbox')]";
const textarea = "textarea[name='2020-03-h-03-02']";

const section3hLink = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section3hTitle = "(//h2)[3]";
const part1Question1 = "(//label[contains(@for, 'radio')])[1]";
const part1Question1a = "(//label[contains(@for, 'radio')])[2]";
const part2ChooseFileButton = "//input[@id='textfield_229']";
const part2HideUploadButton = "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";
const part2Question2 = "(//label[contains(@for, 'radio')])[7]";
const part2Question3 = "(//label[contains(@for, 'radio')])[11]";
const part2Question4 = "(//label[contains(@for, 'radio')])[14]";
const part2Question5 = "(//label[contains(@for, 'radio')])[16]";
const part2Question6 = "//textarea[@id='textfield_244']";
const button_next = "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";
const button_previous = "//button[@class='ds-c-button ds-c-button']";


export class Section3Hpage {

    clickSection3hLink(){
        cy.xpath(section3hLink).click();
    }

    verifySection3hTitle(){
        cy.xpath(section3hTitle).should('be.visible');
    }

    verifyQuestion1(){
        cy.xpath(part1Question1).should('be.checked');
    }

    verifyQuestion1a(){
        cy.xpath(part1Question1a).should('be.checked');
    }

    verifyChooseFile(){
        cy.xpath(part2ChooseFileButton).should('be.visible');
    }

    verifyHideUpload(){
        cy.xpath(part2HideUploadButton).should('be.visible');
    }

    verifyQuestion2(){
        cy.xpath(part2Question2).should('be.checked');
    }

    verifyQuestion3(){
        cy.xpath(part2Question3).should('be.checked');
    }

    verifyQuestion4(){
        cy.xpath(part2Question4).should('be.checked');
    }

    verifyQuestion5(){
        cy.xpath(part2Question5).should('be.checked');
    }

    verifyQuestion6(){
        cy.xpath(part2Question6).should('be.visible');
    }

    verifyPreviousButton(){
        cy.xpath(button_previous).should('be.visible');
    }

    verifyNextButton(){
        cy.xpath(button_next).should('be.visible');
    }

}
export default Section3Hpage;