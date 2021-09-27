/// <reference types="Cypress" />

import * as enJson from '../../i18n/en.json'
import { TipsPage } from '../page-objects/tips-page'
import { PopupPage } from '../page-objects/popup-page'
import { SearchPage } from '../page-objects/search-page'

const searchPage = new SearchPage()
const tipsPage = new TipsPage()
const popupPage = new PopupPage()
const tipsMenuListEnglishText = [enJson['tips-read'],
  enJson['tips-search'],
  enJson['tips-switch'],
  enJson['tips-about']]

describe('Tips page', () => {
  let firstElementOfTheTipsMenuList
  beforeEach(() => {
    cy.navigateToHomePage()
    searchPage.navigateToTipsPage()
    firstElementOfTheTipsMenuList = tipsPage.tipsList().children().first()
  })

  it('show all the items in the list', () => {
    tipsPage.tipsList().should('have.text', tipsMenuListEnglishText.join(''))
  })

  it('down arrow changes selection', () => {
    firstElementOfTheTipsMenuList.should('have.attr', 'nav-selected', 'true')
    firstElementOfTheTipsMenuList.next().should('have.attr', 'nav-selected', 'false')
    cy.downArrow()
    tipsPage.tipsList().children().first().should('have.attr', 'nav-selected', 'false')
    firstElementOfTheTipsMenuList.next().should('have.attr', 'nav-selected', 'true')
  })

  it('only the first element should be selected on load', () => {
    cy.get('.list').children().first().should('have.attr', 'nav-selected', 'true')
    firstElementOfTheTipsMenuList.next().should('have.attr', 'nav-selected', 'false')
  })

  it('navigates through all tips', () => {
    cy.enter()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-read-header'])
    cy.getRightSoftkeyButton().click()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-search-header'])
    cy.getRightSoftkeyButton().click()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-switch-header'])
    cy.getRightSoftkeyButton().click()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-about-header'])
    cy.getLeftSoftkeyButton().click()
    tipsPage.tipsList().children().first().should('have.attr', 'nav-selected', 'true')
  })

  it('check read tip', () => {
    cy.enter()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-read-header'])
    popupPage.getFullscreenContent().get('.tip-text').should('have.text', enJson['tip-read-message'])
    popupPage.getFullscreenContent().get('.tip-animation').should('have.attr', 'style').and('contains', 'tip-read-animation.gif')
    cy.getCenterSoftkeyButton().click()
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-menu'])
  })

  it('check search tip', () => {
    cy.downArrow().enter()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-search-header'])
    popupPage.getFullscreenContent().get('.tip-text').should('have.text', enJson['tip-search-message'])
    popupPage.getFullscreenContent().get('.tip-animation').should('have.attr', 'style').and('contains', 'tip-search-animation.gif')
    cy.getCenterSoftkeyButton().click()
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-settings'])
  })

  it('check switch tip', () => {
    cy.downArrow(2).enter()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-switch-header'])
    popupPage.getFullscreenContent().get('.tip-text').should('have.text', enJson['tip-switch-message'])
    popupPage.getFullscreenContent().get('.tip-animation').should('have.attr', 'style').and('contains', 'tip-switch-animation.gif')
    cy.getCenterSoftkeyButton().click()
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-menu'])
  })

  it('check about tip', () => {
    cy.downArrow(3).enter()
    popupPage.getFullscreenContent().get('.tip-header').should('have.text', enJson['tip-about-header'])
    popupPage.getFullscreenContent().get('.tip-text').should('have.text', enJson['tip-about-message'])
    popupPage.getFullscreenContent().get('.tip-image').should('have.attr', 'style').and('contains', 'onboarding-0.png')
  })
})
