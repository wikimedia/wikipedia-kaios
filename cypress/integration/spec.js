/// <reference types="Cypress" />

import { SearchPage } from "../page-objects/search-page"
import { ArticlePage } from "../page-objects/article-page"

const searchPage = new SearchPage()
const articlePage = new ArticlePage()
describe('Article search', () =>{
  beforeEach(() =>{
    searchPage.navigateToSearchPage()
  })

  it('search should show results', () => {
    searchPage.search("catt")
    searchPage.results().first()
      .should('have.text', "CattDisambiguation page providing links to topics that could be referred to by the same search term")
  })

  it('results with image should show image', () => {
    searchPage.search("cattle")
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('results without image should not show image', () => {
    searchPage.search("catt")
    searchPage.results().first()
      .children().first().next().should('not.exist')
  })
  
  it('article should open from search results page', () => {
    searchPage.search("catt")
    searchPage.results().first()
    cy.enter()
    cy.downArrow()
    cy.enter()
    articlePage.title().should('have.text', "Catt")
  })

  it('back button should take us to search page with results', () => {
    searchPage.search("cattle")
    searchPage.results().first()
    cy.enter()
    cy.downArrow()
    cy.enter()
    articlePage.title().should('have.text', "Cattle")
    cy.clickCloseButton()
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })
})
