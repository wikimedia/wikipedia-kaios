/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'
import * as enJson from '../../i18n/en.json'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()
describe('Intercept search', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('search should show results', () => {
    searchPage.search('catt')
    cy.intercept('/api.php', {fixture: 'catt-search.json'})
    searchPage.results().first()
      .should('exist')
  })
  
})