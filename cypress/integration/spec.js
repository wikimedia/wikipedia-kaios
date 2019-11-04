/// <reference types="Cypress" />
// @ts-check

it('loads', () => {
  cy.visit('localhost:3000')
  cy.contains('h1', 'todos')
  cy.screenshot({
    capture: 'runner'
  })

})