/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
const articlePage = new ArticlePage()

describe('special cases tests', () => {
  it('image without necessary fields should not show the about button', () => {
    cy.navigateToHomePage()
    cy.visit('http://127.0.0.1:8080/#/article/mr/%E0%A4%AD%E0%A4%BE%E0%A4%B0%E0%A4%A4%E0%A5%80%E0%A4%AF_%E0%A4%B0%E0%A5%87%E0%A4%B2%E0%A5%8D%E0%A4%B5%E0%A5%87')
    articlePage.title().should('have.text', 'भारतीय रेल्वे')
    cy.rightArrow().rightArrow().enter()
    articlePage.galleryImage().should('be.visible')
    cy.getCenterSoftkeyButton().should('have.text', '')
  })
})
