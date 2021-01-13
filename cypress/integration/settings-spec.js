/// <reference types="Cypress" />

import * as enJson from '../../i18n/en.json'
import * as nlJson from '../../i18n/nl.json'
import { SettingsPage } from '../page-objects/settings-page'
import { SearchPage } from '../page-objects/search-page'
import { LanguageSettingsPage } from '../page-objects/language-settings-page'
import { AboutAppPage } from '../page-objects/about-app-page.js'
import { AboutWikipediaPage } from '../page-objects/about-wikipedia-page.js'

const searchPage = new SearchPage()
const settingsPage = new SettingsPage()
const languageSettingsPage = new LanguageSettingsPage()
const aboutAppPage = new AboutAppPage()
const aboutWikipediaPage = new AboutWikipediaPage()
const settingsMenuListEnglishText = [enJson['settings-language'],
  enJson['settings-help-feedback'],
  enJson['settings-about-wikipedia'],
  enJson['settings-about-app'],
  enJson['settings-privacy-terms']]
const languageSettingsPopupEnglishText = enJson['language-setting-message']
const settingsMenuListDutchText = [nlJson['settings-language'],
  nlJson['settings-help-feedback'],
  nlJson['settings-about-wikipedia'],
  nlJson['settings-about-app'],
  nlJson['settings-privacy-terms']]

describe('settings page', () => {
  var firstElementOfTheSettingsMenuList
  beforeEach(() => {
    cy.navigateToHomePage()
    searchPage.navigateToSettingsPage()
    firstElementOfTheSettingsMenuList = settingsPage.settingsList().children().first()
  })

  it('show all the items in the list', () => {
    settingsPage.settingsList().should('have.text', settingsMenuListEnglishText.join(''))
  })

  it('down arrow changes selection', () => {
    firstElementOfTheSettingsMenuList.should('have.attr', 'nav-selected', 'true')
    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'false')
    cy.downArrow()
    settingsPage.settingsList().children().first().should('have.attr', 'nav-selected', 'false')
    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'true')
  })

  it('only the first element should be selected on load', () => {
    cy.get('.list').children().first().should('have.attr', 'nav-selected', 'true')
    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'false')
  })

  it('language of the app should change', () => {
    languageSettingsPage.selectOptionFromSettings('Language')
    languageSettingsPage.popupTitleElement().should('have.text', enJson['language-setting'])
    languageSettingsPage.popupTextElement().should('have.text', languageSettingsPopupEnglishText)
    cy.enter()
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-search'])
    cy.downArrow().enter()
    settingsPage.settingsList().should('have.text', settingsMenuListDutchText.join(''))
  })

  it('search for language on settings', () => {
    languageSettingsPage.selectOptionFromSettings('Language')
    cy.enter()
    cy.getRightSoftkeyButton().click()
    cy.get('div.list').should('not.contain.text', 'Português')
    cy.get('input').type('port')
    cy.get('div.list').should('contain.text', 'Português')
  })

  it('check about app page', () => {
    languageSettingsPage.selectOptionFromSettings('About the app')
    aboutAppPage.getHeader().should('have.text', enJson['about-header'])
    aboutAppPage.getImage().should('have.attr', 'src', '/images/onboarding-0.png')
    aboutAppPage.getVersion().should('contain', '1.0.0')
    aboutAppPage.getMessage().should('have.text', enJson['about-app-message'])
  })

  it('check about wikipedia page', () => {
    languageSettingsPage.selectOptionFromSettings('About Wikipedia')
    aboutWikipediaPage.getHeader().should('have.text', enJson['about-wikipedia-header'])
    aboutWikipediaPage.getImage().should('have.attr', 'src', '/images/onboarding-0.png')
    aboutWikipediaPage.getTitle().should('have.text', enJson['onboarding-0-title'])
    aboutWikipediaPage.getDescription().should('have.text', enJson['onboarding-0-description'])
    cy.getRightSoftkeyButton().click()

    aboutWikipediaPage.getImage().should('have.attr', 'src', '/images/onboarding-1.png')
    aboutWikipediaPage.getTitle().should('have.text', enJson['onboarding-1-title'])
    aboutWikipediaPage.getDescription().should('have.text', enJson['onboarding-1-description'])
    cy.getRightSoftkeyButton().click()

    aboutWikipediaPage.getImage().should('have.attr', 'src', '/images/onboarding-2.png')
    aboutWikipediaPage.getTitle().should('have.text', enJson['onboarding-2-title'])
    aboutWikipediaPage.getDescription().should('have.text', enJson['onboarding-2-description'])
    cy.getLeftSoftkeyButton().click()
    cy.getLeftSoftkeyButton().click()
    cy.getLeftSoftkeyButton().click()
    cy.get('.item>.info>.title').first().should('have.text', enJson['settings-language'])
  })

  it('check close about wikipedia page', () => {
    languageSettingsPage.selectOptionFromSettings('About Wikipedia')
    aboutWikipediaPage.getHeader().should('have.text', enJson['about-wikipedia-header'])
    cy.getRightSoftkeyButton().click()
    aboutWikipediaPage.getImage().should('have.attr', 'src', '/images/onboarding-1.png')
    cy.getRightSoftkeyButton().click()
    cy.getCenterSoftkeyButton().should('have.text', enJson['softkey-close'])
    cy.getCenterSoftkeyButton().click()
    cy.get('.item>.info>.title').first().should('have.text', enJson['settings-language'])
  })
})
