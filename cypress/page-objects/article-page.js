export class ArticlePage {
  title () {
    return cy.get('.title')
  }

  footerTitle () {
    return cy.get('.article-footer .content h2')
  }
}
