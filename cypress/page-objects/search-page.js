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

  selectOptionFromSearchResultsList (option) {
    this.results()
      .each(($el, index, $list) => {
        if ($el.attr('data-selected-key') === option) {
          return false
        } else {
          cy.downArrow()
        }
      })
      .then(() => {
        cy.enter()
      })
  }
}
