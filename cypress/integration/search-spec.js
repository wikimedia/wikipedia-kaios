/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'
import * as enJson from '../../i18n/en.json'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()
describe('Article search', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('search should show results', () => {
    cy.intercept('/api.php', { fixture: 'catt-search.json' })
    searchPage.search('catt')
    searchPage.results().first()
      .should('exist')
  })

  it('results with image should show image', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('results without image should not show image', () => {
    cy.intercept('/api.php', { fixture: 'helena-catt-search.json' })
    searchPage.search('Helena Catt')
    searchPage.results().first()
      .children().first().next().should('not.exist')
  })

  it('article should open from search results page', () => {
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cattle')
  })

  it('back button should take us to search page with results', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cattle')
    cy.clickCloseButton()
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('back button should take us to home page', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    cy.downArrow()
    cy.backspace()
    cy.get('.listview').should('not.exist')
  })

  it('end call button should take us to home page', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    cy.downArrow()
    cy.endCall()
    cy.get('.listview').should('not.exist')
  })

  it('should show empty result found when search for "adf23cv111111"', () => {
    searchPage.search('adf23cv111111')
    searchPage.getEmptyContent().should('have.text', enJson['no-result-found'])
  })

  it('center softkey should change when focus on result and search input', () => {
    cy.intercept('/api.php', { fixture: 'cat-search.json' })
    searchPage.search('cat')
    cy.getCenterSoftkeyButton().should('not.have.text')
    searchPage.results().first()
    cy.wait(500) // eslint-disable-line cypress/no-unnecessary-waiting
    cy.downArrow()
    cy.getCenterSoftkeyButton().should('have.text', enJson['centerkey-select'])
    cy.upArrow()
    cy.getCenterSoftkeyButton().should('not.have.text')
  })
})
