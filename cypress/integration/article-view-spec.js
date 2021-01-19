/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { QuickFactsPage } from '../page-objects/quick-facts-page'
import * as enJson from '../../i18n/en.json'
import * as ptJson from '../../i18n/pt.json'
import { PopupPage } from '../page-objects/popup-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'
import { SearchPage } from '../page-objects/search-page'

const articlePage = new ArticlePage()
const quickFactsPage = new QuickFactsPage()
const popupPage = new PopupPage()
const articleMenuPage = new ArticleMenuPage()
const searchPage = new SearchPage()

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('português')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
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

  it('check footer changes language', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('português')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    articlePage.title().should('have.text', 'Gato')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Artigos_sugeridos')
    articlePage.footerTitle().should('have.text', ptJson['suggested-articles'])
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
    quickFactsPage.table().should('contains.text', 'Various types of the domestic cat')
    cy.clickCloseButton()
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    quickFactsPage.table().should('contains.text', 'Various types of the domestic cat')
  })

  it('check quick facts link opens', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('quickfacts')
    quickFactsPage.table().get('div a ').should('contain.text', 'Conservation status')
    cy.enter(2)
    articlePage.title().should('have.text', 'Conservation status')
    cy.clickMenuButton().click()
    articleMenuPage.getPreviousArticleName().should('have.text', 'Cat')
    articleMenuPage.selectOptionFromArticleMenu('Previous article')
    articlePage.title().should('have.text', 'Cat')
  })

  it('check text size change', () => {
    goToCatArticle()
    articlePage.selectOptionFromArticleMenu('Text size')
    popupPage.getHeader().should('have.text', enJson['header-textsize'])
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    cy.downArrow(3)
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.rightArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.rightArrow(4)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '20px')
  })

  it('check text size remains after switching sections', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Cats_by_location')
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after new search', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromArticleMenu('Search Wikipedia')
    cy.get('input[type=text]').type('cattle')
    searchPage.results().first()
    cy.downArrow()
    cy.enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after going to new article', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    cy.rightArrow().enter()
    popupPage.getText().should('have.css', 'font-size', '14px')
    cy.enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after changing on preview', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    cy.downArrow().enter()
    popupPage.getText().should('have.css', 'font-size', '14px')
    cy.enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check down arrow to hint user to use dpad down', () => {
    goToCatArticle()
    articlePage.getDownArrowIndicator().should('be.visible')
    cy.downArrow()
    articlePage.getDownArrowIndicator().should('not.be.visible')
  })

  it('check down arrow doesnt show', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Catt')
    articlePage.title().should('have.text', 'Catt')
    articlePage.getDownArrowIndicator().should('not.exist')
    cy.downArrow()
    articlePage.getDownArrowIndicator().should('not.exist')
  })

  it('check table is showing', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Dynamics_(music)')
    articlePage.title().should('have.text', 'Dynamics (music)')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Dynamic_markings')
    cy.rightArrow()
    cy.get('table.wikitable>caption>b').should('have.text', 'More Information:')
    cy.enter()
    cy.get('div.popup-content.fullscreen').should('be.visible')
    cy.get('div.popup-content.fullscreen tr>th').should('be.visible')
  })
})

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Cat')
  articlePage.title().should('have.text', 'Cat')
}
