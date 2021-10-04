const welcome_banner = "//h2[text()='Welcome!']";
const help_desk_link = ".main [href]";
const state_territory_name_input = "input[name='2020-00-a-01-01']";
const program_type = "div:nth-of-type(1) > .ds-c-label > span";  //need to check
const chip_program_names = "textarea[name='2020-00-a-01-03']";
const contact_name = ".main .question:nth-child(2) [type]";
const job_title = ".main .question:nth-child(3) [type]";
const email = ".main .question:nth-child(7) .question:nth-child(4) [type]";
const mailing_address = "textarea[name='2020-00-a-01-07']";
const phone_number = "input[name='2020-00-a-01-08']";
const disclosures = ".main .question:nth-child(7) .question:nth-child(7) .ds-c-field__hint";
const next_button = "[type='submit']";
const diabled_elements = "//input[@disabled]";  //need to check 


export class BasicStateInformationpage {
    validateWelcomeBanner()
    {
        cy.xpath(welcome_banner).should('be.visible');
    }

    verifyStateTeritoryName()
    {
        cy.get(state_territory_name_input).scrollIntoView();
        cy.get(state_territory_name_input).should('be.visible');
    }

    verifyProgramType(){
        cy.get(program_type).scrollIntoView();
        cy.get(program_type).should('be.visible');
    }

    verifyCHIPprogramNameInput(){
        cy.get(chip_program_names).scrollIntoView();
        cy.get(chip_program_names).should('be.visible');
    }

    verifyContactNameInput(){
        cy.get(contact_name).scrollIntoView();
        cy.get(contact_name).should('be.visible');
    }

    verifyJobTitleInput(){
        cy.get(job_title).scrollIntoView();
        cy.get(job_title).should('be.visible');
    }

    verifyEmailInput(){
        cy.get(email).should('be.visible');
    }

    verifyFullMailingAddressInput(){
        cy.get(mailing_address).should('be.visible');
    }

    verifyPhoneNumberInput(){
        cy.get(phone_number).should('be.visible');
    }

    verifyDisclosureStatement(){
        cy.get(disclosures).should('be.visible');
    }

    verifyNextButton(){
        cy.get(next_button).should('be.visible');
    }
}
export default BasicStateInformationpage;
