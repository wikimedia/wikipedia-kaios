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
    searchPage.search('catt')
    searchPage.results().first()
      .should('have.text', 'CattCatt or CATT may refer to: Alfred Catt (1833–1919), Australian parliamentarian Anthony Catt (1933–2018), English cricketer Carrie Chapman Catt (1859–1947)')
  })

  it('results with image should show image', () => {
    searchPage.search('cattle')
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('results without image should not show image', () => {
    searchPage.search('catt')
    searchPage.results().first()
      .children().first().next().should('not.exist')
  })

  it('article should open from search results page', () => {
    searchPage.search('catt')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Catt')
  })

  it('back button should take us to search page with results', () => {
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cattle')
    cy.clickCloseButton()
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('should show empty result found when search for "adf23cv111111"', () => {
    searchPage.search('adf23cv111111')
    searchPage.getEmptyContent().should('have.text', enJson['no-result-found'])
  })

  it('center softkey should change when focus on result and search input', () => {
    searchPage.search('cat')
    cy.getCenterSoftkeyButton().should('not.have.text')
    searchPage.results().first()
    cy.downArrow().downArrow()
    cy.getCenterSoftkeyButton().should('have.text', enJson['centerkey-select'])
    cy.upArrow().upArrow()
    cy.getCenterSoftkeyButton().should('not.have.text')
  })
})
