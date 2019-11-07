/// <reference types="Cypress" />

import { SearchPage } from "../page-objects/search-page"

// @ts-check
const searchPage = new SearchPage()
describe('Article search', () =>{
  

  beforeEach(() =>{
    searchPage.navigateToSearchPage()
    searchPage.search("catt")
  })

  it('search should show results', () => {
    cy.get('.result').first()
      .should('have.text', "Cattaraugus County, New YorkCounty in New York")
  })

  it('results with image should show image', () => {
    cy.get('.result').first()
      .children().should('have.length', 2)
  })

  it('results without image should not show image', () => {
    cy.get('.result').first().next()
      .children().should('have.length', 1)
  })

  
})
it.only('article should open from search results page', () => {
  searchPage.navigateToSearchPage()
  cy.get('input[type=text]').type("catt")
  cy.get('.result').first().next()
      .children().should('have.length', 1)
  cy.get('body').type('{enter}').type('{downarrow}').type('{enter}')
  cy.get('.title').should('have.text', "Cattaraugus County, New York")
//cy.get('body').type('{uparrow}{uparrow}{downarrow}{downarrow}{leftarrow}{rightarrow}{leftarrow}{rightarrow}')
})
