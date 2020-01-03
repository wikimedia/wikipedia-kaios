export class LanguageSettingsPage{
    popupTextElement(){
        return cy.get('.preview-text')
    }

    popupTitleElement(){
        return cy.get('.language-message > .header')
    }

    headerElement(){
        return cy.get('.header')
    }
}