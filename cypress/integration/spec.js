/// <reference types="Cypress" />

import { SearchPage } from "../page-objects/search-page"
import { BasePage } from "../page-objects/base-page"

// @ts-check
const searchPage = new SearchPage()
const basePage = new BasePage()
describe('Article search', () =>{
  beforeEach(() =>{
    searchPage.navigateToSearchPage()
    searchPage.search("catt")
  })

  it('search should show results', () => {
    searchPage.results().first()
      .should('have.text', "CattDisambiguation page providing links to topics that could be referred to by the same search term")
  })

  it('results with image should show image', () => {
    searchPage.results().first().next()
      .children().should('have.length', 2)
  })

  it('results without image should not show image', () => {
    searchPage.results().first().next().next()
      .children().should('have.length', 1)
  })
  
  it('article should open from search results page', () => {
    searchPage.results().first()
    basePage.pressEnterKey()
    basePage.pressDownArrowKey()
    basePage.pressEnterKey()
    cy.get('.title').should('have.text', "Catt")
  })
})
