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
    cy.downArrow().downArrow().downArrow().enter()
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
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    articlePage.recommendationsList()
      .first().should('have.text', 'Trap–neuter–returnstrategy for controlling feral animal populations')
    articlePage.recommendationsList().next().first().should('have.text', 'Feral catdomestic cat that has returned to the wild')
    articlePage.recommendationsList().next().next().should('have.text', 'Scottish wildcatSmall wild cat')
    cy.downArrow()
    articlePage.footerImage().should('exist')
    articlePage.footerLicense().should('exist')
      .should('exist')
  })
})
