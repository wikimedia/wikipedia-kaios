export class SearchPage {
  search (text) {
    this.getSearchTextBox().type(text)
  }

  results () {
    return cy.get('.item')
  }

  getEmptyContent () {
    return cy.get('.empty')
  }

  navigateToSettingsPage () {
    cy.clickSettingsButton()
  }

  getSearchTextBox () {
    return cy.get('input[type=text]')
  }
}
