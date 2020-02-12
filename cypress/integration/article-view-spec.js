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
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    cy.getLeftSoftkeyButton().click()
    cy.downArrow().downArrow().downArrow().downArrow().enter()
    cy.get('input').type('portugues')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    cy.getRightSoftkeyButton().click()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    cy.enter().upArrow().enter()
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    articlePage.recommendationsList().should('have.length', 3)
    cy.downArrow()
    articlePage.footerImage().should('exist')
    articlePage.footerLicense().should('exist')
      .should('exist')
  })

  it('check image gallery', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    cy.rightArrow().rightArrow().enter()
    articlePage.galleryImage().should('be.visible')
    cy.enter()
    articlePage.galleryPopupHeader().should('be.visible')
    cy.getLeftSoftkeyButton().should('have.text', enJson['softkey-more-info'])
  })

  it('check quick facts opens', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    articlePage.goToQuickFactsFromArticleLandingPage()
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
    cy.getRightSoftkeyButton().click()
    articlePage.goToQuickFactsFromMenu()
    quickFactsPage.table().should('contains.text', 'Various types of domestic cat')
  })

  it('check quick facts link opens', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    articlePage.goToQuickFactsFromArticleLandingPage()
    cy.rightArrow().enter()
    articlePreviewPage.getTitle().should('have.text', 'Taxonomy (biology)')
    cy.enter()
    articlePage.title().should('have.text', 'Taxonomy (biology)')
    cy.getLeftSoftkeyButton().click()
    articleMenuPage.getPreviousArticleName().should('have.text', 'Cat')
    cy.enter()
    articlePage.title().should('have.text', 'Cat')
  })
})
