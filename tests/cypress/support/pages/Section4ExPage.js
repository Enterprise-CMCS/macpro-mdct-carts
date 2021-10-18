
const textAreas = "//textarea[@id]";                   // 92 of them 
const textInputs = "//input[@id and @type='text']";    // 84 of them
const radioInputs = "//input[@id and @type='radio']"   // 84 of them
const uploadButtons = "//button[text()='Upload']";     // 15 of them 
const hideUploadButtons = "//button[text()='Hide Uploaded']" // 15 of them 
const deleteLastItemButtons = "//button[contains(text(), 'Delete last')]";  // 4 of them 
const addAnotherButtons = "//button[contains(text(), 'Add')]";     // 7 of them 
const allLabels = "(//label[@class='ds-c-label'])";  // 275 of them 
const section4Link = "//a[@class='ds-c-vertical-nav__label ds-c-vertical-nav__label--current']";
const section4Title = "(//h2)[2]";

export class Section4ExPage {

    clickSection4link(){
        cy.xpath(section4Link).click();
    }

    verifySection4Title(){
        cy.xpath(section4Title).should('be.visible');
    }

    verifyTextAreas() 
    {
        cy.xpath(textAreas).each((item, index, list) => {
            expect(list).to.have.length(92);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

    verifyTextInputs()
    {
        cy.xpath(textInputs).each((item, index, list) => {
            expect(list).to.have.length(84);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

    verifyRadioInputs()
    {
        cy.xpath(radioInputs).each((item, index, list) => {
            expect(list).to.have.length(84);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

    verifyUploadButtons()
    {
        cy.xpath(uploadButtons).each((item, index, list) => {
            expect(list).to.have.length(15);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
            cy.wrap(item).should("contain.text", "Upload");
        })
    }

    verifyHideUploadButtons()
    {
        cy.xpath(hideUploadButtons).each((item, index, list) => {
            expect(list).to.have.length(15);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
            cy.wrap(item).should("contain.text", "Hide Uploaded");
        })
    }

    verifyDeleteLastItemButtons()
    {
        cy.xpath(deleteLastItemButtons).each((item, index, list) => {
            expect(list).to.have.length(4);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

    verifyAddAnotherItemButtons()
    {
        cy.xpath(addAnotherButtons).each((item, index, list) => {
            expect(list).to.have.length(7);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

    verifyAllLabels()
    {
        cy.xpath(allLabels).each((item, index, list) => {
            expect(list).to.have.length(275);      // number of element item
            cy.wrap(item).should('be.visible');  // checking for visibility
        })
    }

}
export default Section4ExPage;