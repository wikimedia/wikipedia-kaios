export class ArticleMenuPage {
  getPreviousArticleName () {
    return cy.get('div.info > div.description')
  }

  selectOption (option) {
    cy
      .get('.item')
      .each(($el, index, $list) => {
        if ($el.text() === option) {
          cy.getCenterSoftkeyButton().should('have.text', 'Select')
            .click()
        } else {
          cy.downArrow()
        }
      })
  }
}
