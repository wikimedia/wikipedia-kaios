export class SearchPage {

    search(text){
        cy.get('input[type=text]').type(text)
    }

    results(){
        return cy.get('.item')
    }
}
