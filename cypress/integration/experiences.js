/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'

const articlePage = new ArticlePage()
const articleMenuPage = new ArticleMenuPage()

describe('Article view', () => {
  it('change article language', () => {
    cy.setLocalStorage('has-onboard-before', true)
    cy.visit('http://127.0.0.1:8080/#/article/en/Cat')
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('português')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    cy.clickDoneButton()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Suggested_articles')
    cy.screenshot()
    // articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    // articlePage.recommendationsList().should('have.length', 3)
    // cy.downArrow()
    // articlePage.footerImage().should('exist')
    // articlePage.footerLicense().should('exist')
    //   .should('exist')
  })
})
