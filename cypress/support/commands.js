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
[
  'downArrow',
  'upArrow',
  'leftArrow',
  'rightArrow',
  'backspace',
  'enter'
].forEach((key) => {
  Cypress.Commands.add(key, () => {
    cy.get('body').type(`{${key}}`)
  })
})

Cypress.Commands.add('getLeftSoftkeyButton', () => {
  return cy.get('.softkey > .left')
})

Cypress.Commands.add('getRightSoftkeyButton', () => {
  return cy.get('.softkey > .right')
})

Cypress.Commands.add('clickCloseButton', () => {
  cy.getRightSoftkeyButton().contains('Close').click()
})

Cypress.Commands.add('clickSettingsButton', () => {
  cy.getLeftSoftkeyButton().contains('Settings').click()
})

Cypress.Commands.add('navigateToHomePage', () => {
  localStorage.setItem('has-onboard-before', true)
  cy.visit('http://127.0.0.1:8080')
})
