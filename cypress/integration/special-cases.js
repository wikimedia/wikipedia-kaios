/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'
const articlePage = new ArticlePage()
const articleMenuPage = new ArticleMenuPage()

describe('special cases tests', () => {
  it('image without necessary fields should not show the about button', () => {
    cy.navigateToPageWithoutOnboarding('article/mr/%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A5%80%E0%A4%AF_%E0%A4%B0%E0%A5%87%E0%A4%B2%E0%A5%8D%E0%A4%B5%E0%A5%87')
    articlePage.title().should('have.text', 'भारतीय रेल्वे')
    articlePage.selectOptionFromActionsMenu('gallery')
    articlePage.galleryImage().should('be.visible')
    cy.getCenterSoftkeyButton().should('have.text', '')
  })

  it('special page article should open', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Help%3AIPA%2FEnglish')
    articlePage.title().should('have.text', 'Help:IPA/English')
    cy.get('.article-content').should('contain.text', 'Throughout Wikipedia, the pronunciation of words is indicated by means of the ')
  })

  it('languages option should not be available for article in one single language', () => {
    cy.navigateToPageWithoutOnboarding('article/pt/Bruscos')
    articlePage.title().should('have.text', 'Bruscos')
    articlePage.getActionsSectionButton('languages').should('not.exist')
    cy.clickMenuButton()
    articleMenuPage.getMenuOption('Language').should('not.exist')
  })

  it('gallery opens from a non-english article', () => {
    cy.navigateToPageWithoutOnboarding('article/pl/Tupolew_Tu-154')
    articlePage.title().should('have.text', 'Tu-154')
    cy.waitUntil(() => {
      if (Cypress.$('a[href="#cite_note-24"][data-selected="true"]').length) {
        return true
      } else {
        return cy.downArrow().then(() => false)
      }
    })
    cy.rightArrow()
    cy.enter()
    cy.get('.gallery.hasHeader>.header').should('be.visible')
    cy.get('.gallery.hasHeader>.img>img').should('be.visible').should('have.attr', 'src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg/320px-Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg')
  })

  it('check goto quickfacts holly', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Holly')
    articlePage.title().should('have.text', 'Holly')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    Cypress._.times(20, (i) => {
      cy.downArrow()
    })
    cy.leftArrow()
    cy.enter()
    cy.get('.info > .title').should('have.text', 'Go to Section "Selected species"')
    cy.enter()
    cy.get('.title').should('have.text', 'Selected species')
  })

  it('check goto quickfacts C', () => {
    cy.navigateToPageWithoutOnboarding('article/en/C')
    articlePage.title().should('have.text', 'C')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    cy.enter()
    cy.get('.info > .title').should('have.text', 'Go to Section "Related characters"')
    cy.enter()
    cy.get('.title').should('have.text', 'Related characters')
  })
})
