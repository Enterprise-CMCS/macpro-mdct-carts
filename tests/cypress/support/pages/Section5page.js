const all_radio_button = "//label[contains(@for, 'radio')]";
const all_checkbox_button = "//label[contains(@for, 'checkbox')]";
const all_textarea = "//textarea";
const file_upload = "[type='file']";
const text_inputs = "//input[@type='text']";
const all_table = "//table";

const section5Link = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section5Title = "(//h2)[2]";
const part1Question1_2020 = "//input[@id='textfield_642']";
const part1Question1_2021 = "//input[@id='textfield_644']";
const part1Question1_2022 = "//input[@id='textfield_646']";

const part1Question2_2020 = "//input[@id='textfield_648']";
const part1Question2_2021 = "//input[@id='textfield_650']";
const part1Question2_2022 = "//input[@id='textfield_652']";

const part1Question3_2020 = "//input[@id='textfield_654']";
const part1Question3_2021 = "//input[@id='textfield_656']";
const part1Question3_2022 = "//input[@id='textfield_658']";

const part1Question4_2020 = "//input[@id='textfield_660']";
const part1Question4_2021 = "//input[@id='textfield_662']";
const part1Question4_2022 = "//input[@id='textfield_664']";

const part1Table1 = "(//table[@id='synthesized-table-1'])[1]";

const part2Question1_2020 = "//input[@id='textfield_666']";
const part2Question1_2021 = "//input[@id='textfield_668']";
const part2Question1_2022 = "//input[@id='textfield_670']";

const part2Question2_2020 = "//input[@id='textfield_672']";
const part2Question2_2021 = "//input[@id='textfield_674']";
const part2Question2_2022 = "//input[@id='textfield_676']";


const part2Question3_2020 = "//input[@id='textfield_678']";
const part2Question3_2021 = "//input[@id='textfield_680']";
const part2Question3_2022 = "//input[@id='textfield_682']";


const part2Question4_2020 = "//input[@id='textfield_684']";
const part2Question4_2021 = "//input[@id='textfield_686']";
const part2Question4_2022 = "//input[@id='textfield_688']";


const part2Question5_2020 = "//input[@id='textfield_690']";
const part2Question5_2021 = "//input[@id='textfield_692']";
const part2Question5_2022 = "//input[@id='textfield_694']";


const part2Question6_2020 = "//input[@id='textfield_696']";
const part2Question6_2021 = "//input[@id='textfield_698']";
const part2Question6_2022 = "//input[@id='textfield_700']";

const part2Question7_2020 = "//input[@id='textfield_702']";
const part2Question7_2021 = "//input[@id='textfield_704']";
const part2Question7_2022 = "//input[@id='textfield_706']";

const part2Table2 = "(//table[@id='synthesized-table-1'])[2]";
const part2Table3 = "(//table[@id='synthesized-table-1'])[3]";

const part2Question8_1 = "(//label[@class='ds-c-label'])[34]";
const part2Question8_2 = "(//label[@class='ds-c-label'])[39]";
const part2Question9 = "(//label[@class='ds-c-label'])[42]";

const part3Question1_2020 = "//input[@id='textfield_708']";
const part3Question1_2021 = "//input[@id='textfield_710']";
const part3Question1_2022 = "//input[@id='textfield_712']";

const part3Question2_2020 = "//input[@id='textfield_714']";
const part3Question2_2021 = "//input[@id='textfield_716']";
const part3Question2_2022 = "//input[@id='textfield_718']";

const part3Table = "(//table[@id='synthesized-table-1'])[4]";

const part4Question1_2020 = "//input[@id='textfield_720']";
const part4Question1_2021 = "//input[@id='textfield_722']";
const part4Question1_2022 = "//input[@id='textfield_724']";

const part4Question2_2020 = "//input[@id='textfield_726']";
const part4Question2_2021 = "//input[@id='textfield_728']";
const part4Question2_2022 = "//input[@id='textfield_730']";

const part4Table = "(//table[@id='synthesized-table-1'])[5]";

const part5Question1 = "//textarea[@id='textfield_638']";
const part5Question2_chooseFile = "//input[@id='textfield_640']";
const part5Question2_hideUpload = "//button[@class='ds-c-button ds-c-button--small margin-left-1em']";

const previousButton = "//button[@class='ds-c-button ds-c-button']";
const nextButton = "//button[@class='ds-c-button ds-c-button ds-c-button--primary']";


export class Section5page {

    clickSection5(){
        cy.xpath(section5Link).click();
    }

    verifySection5Title(){
        cy.xpath(section5Title).should('be.visible');
    }

    verifyPart1(){
        cy.xpath(part1Question1_2020).should('be.visible');
        cy.xpath(part1Question1_2021).should('be.visible');
        cy.xpath(part1Question1_2022).should('be.visible');
        cy.xpath(part1Question2_2020).should('be.visible');
        cy.xpath(part1Question2_2021).should('be.visible');
        cy.xpath(part1Question2_2021).should('be.visible');
        cy.xpath(part1Question3_2020).should('be.visible');
        cy.xpath(part1Question3_2021).should('be.visible');
        cy.xpath(part1Question3_2022).should('be.visible');
        cy.xpath(part1Question4_2020).should('be.visible');
        cy.xpath(part1Question4_2021).should('be.visible');
        cy.xpath(part1Question4_2022).should('be.visible');
        cy.xpath(part1Table1).should('be.visible');
    }

    verifyPart2(){
        cy.xpath(part2Question1_2020).should('be.visible');
        cy.xpath(part2Question1_2021).should('be.visible');
        cy.xpath(part2Question1_2022).should('be.visible');
        cy.xpath(part2Question2_2020).should('be.visible');
        cy.xpath(part2Question2_2021).should('be.visible');
        cy.xpath(part2Question2_2022).should('be.visible');
        cy.xpath(part2Question3_2020).should('be.visible');
        cy.xpath(part2Question3_2021).should('be.visible');
        cy.xpath(part2Question3_2022).should('be.visible');
        cy.xpath(part2Question4_2020).should('be.visible');
        cy.xpath(part2Question4_2021).should('be.visible');
        cy.xpath(part2Question4_2022).should('be.visible');
        cy.xpath(part2Question5_2020).should('be.visible');
        cy.xpath(part2Question5_2021).should('be.visible');
        cy.xpath(part2Question5_2022).should('be.visible');
        cy.xpath(part2Question6_2020).should('be.visible');
        cy.xpath(part2Question6_2021).should('be.visible');
        cy.xpath(part2Question6_2022).should('be.visible');
        cy.xpath(part2Question7_2020).should('be.visible');
        cy.xpath(part2Question7_2021).should('be.visible');
        cy.xpath(part2Question7_2022).should('be.visible');
        cy.xpath(part2Table2).should('be.visible');
        cy.xpath(part2Table3).should('be.visible');
        cy.xpath(part2Question8_1).should('be.visible');
        cy.xpath(part2Question8_2).should('be.visible');
        cy.xpath(part2Question9).should('be.visible');
    }

    verifyPart3(){
        cy.xpath(part3Question1_2020).should('be.visible');
        cy.xpath(part3Question1_2021).should('be.visible');
        cy.xpath(part3Question1_2022).should('be.visible');
        cy.xpath(part3Question2_2020).should('be.visible');
        cy.xpath(part3Question2_2021).should('be.visible');
        cy.xpath(part3Question2_2022).should('be.visible');
        cy.xpath(part3Table).should('be.visible');
    }

    verifyPart4(){
        cy.xpath(part4Question1_2020).should('be.visible');
        cy.xpath(part4Question1_2021).should('be.visible');
        cy.xpath(part4Question1_2022).should('be.visible');
        cy.xpath(part4Question2_2020).should('be.visible');
        cy.xpath(part4Question2_2021).should('be.visible');
        cy.xpath(part4Question2_2022).should('be.visible');
        cy.xpath(part4Table).should('be.visible');
    }

    verifyPart5(){
        cy.xpath(part5Question1).should('be.visible');
        cy.xpath(part5Question2_chooseFile).should('be.visible');
        cy.xpath(part5Question2_hideUpload).should('be.visible');
    }

    verifyNextButton(){
        cy.xpath(nextButton).should('be.visible');
    }

    verifyPreviousButton(){
        cy.xpath(previousButton).should('be.visible');
    }

}
export default Section5page;