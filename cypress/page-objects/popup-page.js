export class PopupPage {
  getTitle () {
    return cy.get('.article-preview .title')
  }

  getHeader () {
    return cy.get('.popup .popup-content .header')
  }

  getContent () {
    return cy.get('.popup .popup-content .content')
  }
}
