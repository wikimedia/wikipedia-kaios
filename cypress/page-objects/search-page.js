export class SearchPage {
    navigateToSearchPage(){
        cy.visit('http://127.0.0.1:8080')
    }

    search(text){
        cy.get('input[type=text]').type(text)
    }

    results(){
        return cy.get('.item')
    }
}
