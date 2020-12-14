/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'

const articlePage = new ArticlePage()

describe('references', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('check preview for references opens', () => {
    goToCatArticle()
    cy.downArrow()
    cy.rightArrow()
    cy.enter()
    cy.get('.ref-title').should('be.visible').should('contain.text', 'Reference [10]')
  })
})

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Cat')
  articlePage.title().should('have.text', 'Cat')
}
