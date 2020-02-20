/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'
import { QuickFactsPage } from '../page-objects/quick-facts-page'
import * as enJson from '../../i18n/en.json'
import { ArticlePreviewPage } from '../page-objects/article-preview-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()
const quickFactsPage = new QuickFactsPage()
const articlePreviewPage = new ArticlePreviewPage()
const articleMenuPage = new ArticleMenuPage()

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    goToArticleFromTheSearchPage('Cat')
    articlePage.selectOptionArticleActionsMenu('languages')
    cy.get('input').type('portugues')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    cy.clickDoneButton()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    goToArticleFromTheSearchPage('Cat')
    //TODO: change the next line to a method on article page
    cy.enter().upArrow().enter()
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    articlePage.recommendationsList().should('have.length', 3)
    cy.downArrow()
    articlePage.footerImage().should('exist')
    articlePage.footerLicense().should('exist')
      .should('exist')
  })

  it('check image gallery', () => {
    goToArticleFromTheSearchPage('Cat')
    articlePage.selectOptionArticleActionsMenu('gallery')
    articlePage.galleryImage().should('be.visible')
    articlePage.galleryImage().invoke('attr', 'src').then((src) => {
      cy.rightArrow()
      articlePage.galleryImage().should('not.have.attr', 'src', src)
    })
    cy.enter()
    articlePage.galleryPopupHeader().should('be.visible')
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-more-info'])
  })

  it('check quick facts opens', () => {
    goToArticleFromTheSearchPage('Cat')
    articlePage.selectOptionArticleActionsMenu("quickfacts")
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
    cy.clickCloseButton()
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
  })

  it('check quick facts link opens', () => {
    goToArticleFromTheSearchPage('Cat')
    articlePage.selectOptionArticleActionsMenu("quickfacts")
    quickFactsPage.table().get('div a ').should('contain.text', 'Conservation status')
    cy.enter()
    articlePreviewPage.getTitle().should('have.text', 'Conservation status')
    cy.enter()
    articlePage.title().should('have.text', 'Conservation status')
    cy.clickMenuButton().click()
    articleMenuPage.getPreviousArticleName().should('have.text', 'Cat')
    articleMenuPage.selectOptionFromArticleMenu('Previous article')
    articlePage.title().should('have.text', 'Cat')
  })
})

function goToArticleFromTheSearchPage(searchTerm) {
  searchPage.search(searchTerm)
  searchPage.results().first()
  cy.enter().downArrow().enter()
  articlePage.title().should('have.text', searchTerm)
}

