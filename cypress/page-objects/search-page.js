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

  getSearchTextBox () {
    return cy.get('input[type=text]')
  }

  selectOptionFromSearchResultsList (option) {
    this.results()
      .each(($el, index, $list) => {
        cy.log($el.attr('data-selected-key')+":  is selected==   "+$el.attr('nav-selected'))
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
