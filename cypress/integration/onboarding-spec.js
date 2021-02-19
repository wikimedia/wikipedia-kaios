/// <reference types="Cypress" />

import { OnboardingPage } from '../page-objects/onboarding-page'
import { SearchPage } from '../page-objects/search-page'
import * as enJson from '../../i18n/en.json'
import * as ptJson from '../../i18n/pt.json'

const onboardingPage = new OnboardingPage()
const searchPage = new SearchPage()

describe('Onboarding (skipping consent)', () => {
  beforeEach(() => {
    cy.navigateToPageWithoutConsent()
  })

  it('onboarding elements should be present', () => {
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-0-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-0-description'])
  })

  it('change language and check onboarding', () => {
    cy.changeBrowserLanguageAndGoToHomePage('pt-PT')
    onboardingPage.getTitle().should('have.text', ptJson['onboarding-0-title'])
  })
})

describe('Onboarding', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('shows consent form after going through onboarding', () => {
    cy.getCenterSoftkeyButton().should('have.text', 'Get started').click()
    cy.getCenterSoftkeyButton().should('have.text', 'Agree').click()
    searchPage.getSearchTextBox().should('be.visible')
  })
})
