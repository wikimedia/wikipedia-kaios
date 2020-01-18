export class SearchPage {
  search (text) {
    this.getSearchTextBox().type(text)
  }

  results () {
    return cy.get('.item')
  }

  navigateToSettingsPage () {
    cy.clickSettingsButton()
  }

  getSearchTextBox () {
    return cy.get('input[type=text]')
  }
}
