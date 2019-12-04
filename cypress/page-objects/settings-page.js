export class SettingsPage {
    navigateToSettingsPage(){
        cy.clickSettingsButton()
    }

    search(text){
        cy.get('input[type=text]').type(text)
    }

    settingsList(){
        return cy.get('.list')
    }
}
