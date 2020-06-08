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
    // Page 0
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-0-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-0-description'])
    cy.getLeftSoftkeyButton().should('have.text', enJson['softkey-skip'])
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-next'])
    cy.getRightSoftkeyButton().click()

    // Page 1
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-1.png')
    onboardingPage.getBackgroundImage().should('be.visible').should('have.attr', 'style').and('contains', 'onboarding-1-background.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-1-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-1-description'])
    cy.getLeftSoftkeyButton().should('have.text', enJson['softkey-back'])
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-next'])
    cy.getRightSoftkeyButton().click()

    // Page 2
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-2.png')
    onboardingPage.getBackgroundImage().should('be.visible').should('have.attr', 'style').and('contains', 'onboarding-2-background.png')
    onboardingPage.getTitle().should('have.text', enJson['onboarding-2-title'])
    onboardingPage.getDescription().should('have.text', enJson['onboarding-2-description'])
    cy.getLeftSoftkeyButton().should('have.text', enJson['softkey-back'])
    cy.getRightSoftkeyButton().should('have.text', '')
    cy.getCenterSoftkeyButton().should('have.text', enJson['softkey-get-started']).click()
    searchPage.getSearchTextBox().should('be.visible')
  })

  it('skip button skips onboarding and sets localStorage variable', () => {
    cy.getLeftSoftkeyButton().should('have.text', 'Skip').click()
    searchPage.getSearchTextBox().should('be.visible')
    cy.visit('/')
    cy.getRightSoftkeyButton().should('have.text', 'Settings')
    cy.getLocalStorage('has-onboard-before').should('equal', 'true')
    searchPage.getSearchTextBox().should('be.visible')
  })

  it('check forward and back movements with soft keys', () => {
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next').click()
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-1.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getLeftSoftkeyButton().should('have.text', 'Back').click()
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getLeftSoftkeyButton().should('have.text', 'Skip')
  })

  it('check forward and back movements with DPad keys', () => {
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.rightArrow()
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-1.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.leftArrow()
    onboardingPage.getMainImage().should('be.visible').should('have.attr', 'src').and('contains', 'onboarding-0.png')
    cy.getRightSoftkeyButton().should('have.text', 'Next')
    cy.getLeftSoftkeyButton().should('have.text', 'Skip')
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

  it('shows consent form after skipping onboarding', () => {
    cy.getLeftSoftkeyButton().should('have.text', 'Skip').click()
    cy.getCenterSoftkeyButton().should('have.text', 'Agree').click()
    searchPage.getSearchTextBox().should('be.visible')
  })

  it('shows consent form after going through onboarding', () => {
    cy.getRightSoftkeyButton().click()
    cy.getRightSoftkeyButton().click()
    cy.getCenterSoftkeyButton().should('have.text', 'Get started').click()
    cy.getCenterSoftkeyButton().should('have.text', 'Agree').click()
    searchPage.getSearchTextBox().should('be.visible')
  })
})
