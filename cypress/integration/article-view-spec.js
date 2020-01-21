/// <reference types="Cypress" />

import { SearchPage } from '../page-objects/search-page'
import { ArticlePage } from '../page-objects/article-page'
import * as enJson from '../../i18n/en.json'

const searchPage = new SearchPage()
const articlePage = new ArticlePage()

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    cy.getLeftSoftkeyButton().click()
    cy.downArrow().downArrow().enter()
    cy.get('input').type('portugues')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    cy.getRightSoftkeyButton().click()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    searchPage.search('cat')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cat')
    cy.enter().upArrow().enter()
    cy.get('h2.adjustable-font-size')
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    cy.get('.list a').first().should('have.attr', 'title').should('be', 'Trap-neuter-return')
    cy.downArrow()
    cy.get('.license').invoke('html').should('eq', enJson['content-license'])

    /*
    How can I make this assertion pass?
    there's an extra  " data-selected="true"" on the HTML.
    I tried to use replace() after the invoke() but it's not a string...
    Error:     AssertionError: expected 'Content is available under <a class="external" rel="mw:ExtLink" href="https://creativecommons.org/licenses/by-sa/3.0/" data-selected="true">CC BY-SA 3.0</a> unless otherwise noted.' to equal 'Content is available under <a class="external" rel="mw:ExtLink" href="https://creativecommons.org/licenses/by-sa/3.0/">CC BY-SA 3.0</a> unless otherwise noted.'
    */
  })
})
