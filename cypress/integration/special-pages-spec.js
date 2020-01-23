/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'

const articlePage = new ArticlePage()

describe('Special Pages', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('special page article should open', () => {
    cy.visit('http://127.0.0.1:8080/#/article/en/Help%3AIPA%2FEnglish')
    articlePage.title().should('have.text', 'Help:IPA/English')
    cy.get('.article-content').should('contain.text', 'Throughout Wikipedia, the pronunciation of words is indicated by means of the ')
  })
})
