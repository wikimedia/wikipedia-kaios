/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter()
    cy.downArrow()
    cy.enter()
    articlePage.title().should('have.text', 'Cat')
    cy.getLeftSoftkeyButton().click()
    cy.downArrow()
    cy.downArrow()
    cy.enter()
    cy.get('input').type('portugues')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow()
    cy.enter()
    cy.getRightSoftkeyButton().click()
    articlePage.title().should('have.text', 'Gato')
  })
})
