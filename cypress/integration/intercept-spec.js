/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'

const searchPage = new SearchPage()

describe('Intercept search', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('search should show results', () => {
    searchPage.search('catt')
    cy.intercept('/api.php', { fixture: 'catt-search.json' })
    searchPage.results().first()
      .should('exist')
  })
})
