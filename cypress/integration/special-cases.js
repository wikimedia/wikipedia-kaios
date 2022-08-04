/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'
const articlePage = new ArticlePage()
const articleMenuPage = new ArticleMenuPage()

describe('special cases tests', () => {
  it('special page article should open', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Help%3AIPA%2FEnglish')
    articlePage.title().should('have.text', 'Help:IPA/English')
    cy.get('.article-content').should('contain.text', 'Throughout Wikipedia, the pronunciation of words is indicated by means of the ')
  })

  it.skip('languages option should not be available for article in one single language', () => {
    cy.navigateToPageWithoutOnboarding('article/pt/Bruscos')
    articlePage.title().should('have.text', 'Bruscos')
    articlePage.getActionsSectionButton('languages').should('not.exist')
    cy.clickMenuButton()
    articleMenuPage.getMenuOption('Language').should('not.exist')
  })

  it('gallery opens from a non-english article', () => {
    cy.navigateToPageWithoutOnboarding('article/pl/Tupolew_Tu-154/Użytkownicy[24]')
    cy.wait(500) // eslint-disable-line cypress/no-unnecessary-waiting
    articlePage.title().should('have.text', 'Użytkownicy[24]')
    cy.enter()
    cy.get('.gallery-view>.img>img').should('be.visible').should('have.attr', 'src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg/240px-Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg')
  })

  it.skip('check goto quickfacts holly', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Holly')
    articlePage.title().should('have.text', 'Holly')
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    Cypress._.times(20, (i) => {
      cy.downArrow()
    })
    cy.leftArrow()
    cy.enter()
    cy.get('.confirm-dialog>.info').should('have.text', 'Go to Section "Selected species"')
    cy.getRightSoftkeyButton().click()
    cy.get('.title').should('have.text', 'Selected species')
  })

  it('check goto quickfacts C', () => {
    cy.navigateToPageWithoutOnboarding('article/en/C')
    articlePage.title().should('have.text', 'C')
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    cy.get('div.quickfacts table.infobox').should('be.visible')
    cy.enter()
    cy.get('.confirm-dialog>.info').should('have.text', 'Go to Section "Related characters"')
    cy.getRightSoftkeyButton().click()
    cy.get('.title').should('have.text', 'Related characters')
  })

  it('backspace on popup', () => {
    cy.navigateToPageWithoutOnboarding('article/en/C')
    articlePage.title().should('have.text', 'C')
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    cy.get('div.quickfacts table.infobox').should('be.visible')
    cy.get('a[data-selected=true][href="./C#Related_characters"]').should('exist')
    cy.enter()
    cy.get('.confirm-dialog>.info').should('have.text', 'Go to Section "Related characters"')
    cy.backspace()
    cy.get('.confirm-dialog>.info').should('not.exist')
    cy.get('div.quickfacts table.infobox').should('be.visible')
  })
})
