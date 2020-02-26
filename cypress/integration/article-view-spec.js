/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { QuickFactsPage } from '../page-objects/quick-facts-page'
import * as enJson from '../../i18n/en.json'
import { PopupPage } from '../page-objects/popup-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'

const articlePage = new ArticlePage()
const quickFactsPage = new QuickFactsPage()
const popupPage = new PopupPage()
const articleMenuPage = new ArticleMenuPage()

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('portugues')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    cy.clickDoneButton()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Suggested_articles')
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    articlePage.recommendationsList().should('have.length', 3)
    cy.downArrow()
    articlePage.footerImage().should('exist')
    articlePage.footerLicense().should('exist')
      .should('exist')
  })

  it('check image gallery', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('gallery')
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
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('quickfacts')
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
    cy.clickCloseButton()
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
  })

  it('check quick facts link opens', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('quickfacts')
    quickFactsPage.table().get('div a ').should('contain.text', 'Conservation status')
    cy.rightArrow().enter()
    popupPage.getTitle().should('have.text', 'Conservation status')
    cy.enter()
    articlePage.title().should('have.text', 'Conservation status')
    cy.clickMenuButton().click()
    articleMenuPage.getPreviousArticleName().should('have.text', 'Cat')
    articleMenuPage.selectOptionFromArticleMenu('Previous article')
    articlePage.title().should('have.text', 'Cat')
  })
})

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Cat')
  articlePage.title().should('have.text', 'Cat')
}
