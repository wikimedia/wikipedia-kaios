/// <reference types="Cypress" />

import { OnboardingPage } from '../page-objects/onboarding-page'
import { SearchPage } from '../page-objects/search-page'
import * as enJson from '../../i18n/en.json'

const onboardingPage = new OnboardingPage()
const searchPage = new SearchPage()

describe('Onboarding', () => {
  beforeEach(() => {
    cy.visit('http://127.0.0.1:8080')
  })

  it('onboarding elements should be present', () => {
    // Page 0
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-0-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-0-description'])
    cy.getLeftSoftkeyButton().should('have.text', 'Skip')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getRightSoftkeyButton().click()

    // Page 1
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-1.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-1-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-1-description'])
    cy.getLeftSoftkeyButton().should('have.text', 'Back')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getRightSoftkeyButton().click()

    // Page 2
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-2.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-2-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-2-description'])
    cy.getLeftSoftkeyButton().should('have.text', 'Back')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getRightSoftkeyButton().click()

    // Page 3
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-3.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-3-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-3-description'])
    cy.getLeftSoftkeyButton().should('have.text', 'Back')
    cy.getRightSoftkeyButton().should('have.text', '')
  })

  it('skip button skips onboarding and sets localStorage variable', () => {
    cy.getLeftSoftkeyButton().should('have.text', 'Skip').click()
    searchPage.getSearchTextBox().should('be.visible')
    cy.visit('http://127.0.0.1:8080')
    cy.getLeftSoftkeyButton().should('have.text', 'Settings')
    cy.getLocalStorage('has-onboard-before').should('equal', 'true')
  })

  it('check forward and back movements', () => {
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next').click()
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-1.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getLeftSoftkeyButton().should('have.text', 'Back').click()
    onboardingPage.getImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getLeftSoftkeyButton().should('have.text', 'Skip')
  })
})

// TODO: change the browser language and check for the change in the onboarding
// right now I can't find a way to do this on cypress, all the examples I've found online don't work
