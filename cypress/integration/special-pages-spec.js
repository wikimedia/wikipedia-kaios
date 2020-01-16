/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()

describe('Special Pages', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('special page article should open', () => {
    searchPage.search('phoenicia')
    searchPage.results().first()
    cy.enter()
    cy.downArrow()
    cy.enter()
    articlePage.title().should('have.text', 'Phoenicia')
    cy.downArrow()
    cy.enter()
    // cy.leftArrow()
    // cy.rightArrow()
  })
})
