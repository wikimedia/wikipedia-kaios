export class ArticleMenuPage {
  getPreviousArticleName () {
    return cy.get('div.info > div.description')
  }

  selectOptionFromArticleMenu (option) {
    var entered=false
    cy
      .get('.item')
      .each(($el, index, $list) => {
        cy.log($el.text())
        if ($el.text() === option) {
          cy.getCenterSoftkeyButton().should('have.text', 'Select')
            .click()
            entered=true
        } else {
          if(!entered){cy.downArrow()}
        }
      })
  }
}
