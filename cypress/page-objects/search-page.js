export class SearchPage {
  search (text) {
    this.getSearchTextBox().type(text)
  }

  results () {
    return cy.get('.item[data-selectable="true"]')
  }

  getEmptyContent () {
    return cy.get('.empty')
  }

  navigateToSettingsPage () {
    cy.clickSettingsButton()
  }

  navigateToTipsPage () {
    cy.clickTipsButton()
  }

  getSearchTextBox () {
    return cy.get('input[type=text]')
  }
}
