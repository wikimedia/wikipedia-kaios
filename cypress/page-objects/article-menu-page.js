export class ArticleMenuPage {
  getPreviousArticleName () {
    return cy.get('.info > .description')
  }

  selectOptionFromArticleMenu (option) {
    cy
      .get('.item')
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

  selectOptionFromSections (option) {
    cy
      .get('.item')
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

  getMenuOption (option) {
    return cy.get('div[data-selected-key="' + option + '"]')
  }
}
