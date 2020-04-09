export class PopupPage {
  getTitle () {
    return cy.get('.article-preview .title')
  }

  getHeader () {
    return cy.get('.popup .popup-content .header').last()
  }

  getContent () {
    return cy.get('.popup .popup-content .content')
    // preview-text adjustable-font-size
  }

  getText () {
    return cy.get('.preview-text.adjustable-font-size')
  }
}
