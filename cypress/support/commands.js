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

import 'cypress-localstorage-commands'

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

Cypress.Commands.add('getCenterSoftkeyButton', () => {
  return cy.get('.softkey > .center')
})

Cypress.Commands.add('clickCloseButton', () => {
  cy.getLeftSoftkeyButton().contains('Close').click()
})

Cypress.Commands.add('clickSettingsButton', () => {
  cy.getRightSoftkeyButton().contains('Settings').click()
})

Cypress.Commands.add('clickMenuButton', () => {
  cy.getRightSoftkeyButton().contains('Menu').click()
})

Cypress.Commands.add('clickDoneButton', () => {
  cy.getLeftSoftkeyButton().contains('Done').click()
})

Cypress.Commands.add('navigateToHomePage', () => {
  cy.setLocalStorage('has-onboard-before', true)
  cy.visit('http://127.0.0.1:8080')
})

Cypress.Commands.add('changeBrowserLanguageAndGoToHomePage', (language) => {
  cy.visit('http://127.0.0.1:8080', {
    onBeforeLoad (win) {
      Object.defineProperty(win.navigator, 'language', {
        get: cy.stub().returns(language).as('language')
      })
    }
  })
})
