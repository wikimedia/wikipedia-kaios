// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
Cypress.Commands.add('downarrow', {
    prevSubject: false
  }, () => {
    cy.get('body').type('{downarrow}')
  })

  Cypress.Commands.add('enter', {
    prevSubject: false
  }, () => {
    cy.get('body').type('{enter}')
  })

  Cypress.Commands.add('uparrow', {
    prevSubject: false
  }, () => {
    cy.get('body').type('{uparrow}')
  })

  Cypress.Commands.add('leftarrow', {
    prevSubject: false
  }, () => {
    cy.get('body').type('{leftarrow}')
  })

  Cypress.Commands.add('rightarrow', {
    prevSubject: false
  }, () => {
    cy.get('body').type('{rightarrow}')
  })