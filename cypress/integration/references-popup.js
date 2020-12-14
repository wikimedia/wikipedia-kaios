/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'

const articlePage = new ArticlePage()

describe('references', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('check preview for references opens', () => {
    goToCatArticle()
    cy.screenshot()
    cy.downArrow()
    cy.screenshot()
    cy.rightArrow()
    cy.screenshot()
    cy.enter()
    cy.screenshot()
    cy.get('.ref-title').should('be.visible').should('contain.text', 'Reference [10]')
    cy.screenshot()
  })
})

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Cat')
  articlePage.title().should('have.text', 'Cat')
}
