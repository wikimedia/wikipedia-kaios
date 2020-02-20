export class ArticleMenuPage {
  getPreviousArticleName () {
    return cy.get('div.info > div.description')
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
}
