export class BasePage {
    pressEnterKey(){
        cy.get('body').type('{enter}')
    }

    pressDownArrowKey(){
        cy.get('body').type('{downarrow}')
    }
}
