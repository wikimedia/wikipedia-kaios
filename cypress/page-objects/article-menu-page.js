export class ArticleMenuPage {
  getPreviousArticleName () {
    return cy.get('div.info > div.description')
  }
}
