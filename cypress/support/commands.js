
import 'cypress-wait-until'
import 'cypress-localstorage-commands'

import * as enJson from '../../i18n/en.json'
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
  cy.getLeftSoftkeyButton().contains(enJson['softkey-close']).click()
})

Cypress.Commands.add('clickSettingsButton', () => {
  cy.getRightSoftkeyButton().contains(enJson['softkey-settings']).click()
})

Cypress.Commands.add('clickMenuButton', () => {
  cy.getRightSoftkeyButton().contains(enJson['softkey-menu']).click()
})

Cypress.Commands.add('clickDoneButton', () => {
  cy.getLeftSoftkeyButton().contains(enJson['softkey-done']).click()
})

Cypress.Commands.add('navigateToHomePage', () => {
  cy.setLocalStorage('has-onboard-before', true)
  cy.setLocalStorage('usage-data-consent', false) // Don't display usage data consent prompt
  cy.visit('http://127.0.0.1:8080')
})

Cypress.Commands.add('navigateToPageWithoutOnboarding', (page) => {
  cy.setLocalStorage('has-onboard-before', true)
  cy.visit('http://127.0.0.1:8080/#/' + page)
})

Cypress.Commands.add('changeBrowserLanguageAndGoToHomePage', (language) => {
  cy.removeLocalStorage('language-app')
  cy.visit('http://127.0.0.1:8080', {
    onBeforeLoad (win) {
      Object.defineProperty(win.navigator, 'language', {
        get: cy.stub().returns(language).as('language')
      })
    }
  })
})
