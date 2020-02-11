export class ArticlePage {
  title () {
    return cy.get('.title')
  }

  footerTitle () {
    return cy.get('.article-footer .content h2')
  }

  recommendationsList () {
    return cy.get('.article-footer .list a')
  }

  footerImage () {
    return cy.get('img[src="/images/wikipedia-wordmark-en.png"]')
  }

  footerLicense () {
    return cy.get('.license')
  }

  footerLinkToWikipedia () {
    return cy.get('.browser .external')
  }

  galleryImage () {
    return cy.get('div.gallery > div.img > img')
  }

  galleryPopupHeader () {
    return cy.get('div.gallery-about > div.header')
  }

  goToQuickFactsFromMenu () {
    cy.getLeftSoftkeyButton().click()
    cy.downArrow().downArrow()
    cy.enter()
  }
  
  goToQuickFactsFromArticleLandingPage () {
    cy.rightArrow()
    cy.enter()
  }
}
