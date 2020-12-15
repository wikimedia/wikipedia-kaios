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
    cy.downArrow()
    cy.screenshot()
    cy.enter()
    cy.screenshot()
    cy.get('div.ref-title').should('be.visible')
    cy.screenshot()
  })
})

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Last_Year%3A_The_Nightmare')
  articlePage.title().should('have.text', 'Last Year: The Nightmare')
}
