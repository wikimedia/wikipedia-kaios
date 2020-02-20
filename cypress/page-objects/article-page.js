import { ArticleMenuPage } from '../page-objects/article-menu-page'
const articleMenuPage = new ArticleMenuPage()

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

  selectOptionArticleActionsMenu (option) {
    var entered = false
    cy
      .get('.article-actions-button')
      .each(($el, index, $list) => {
        if ($el.attr('data-action') === option) {
          cy.enter()
          entered = true
        } else {
          if(!entered){
            cy.rightArrow()
          }
        }
      })
  }

  selectOptionFromArticleMenu(option){
    cy.clickMenuButton()
    articleMenuPage.selectOptionFromArticleMenu(option)
  }
}
