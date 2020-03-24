/// <reference types="Cypress" />

import * as enJson from '../../i18n/en.json'
import { SettingsPage } from '../page-objects/settings-page'
import { SearchPage } from '../page-objects/search-page'
import { LanguageSettingsPage } from '../page-objects/language-settings-page'
import { PopupPage } from '../page-objects/popup-page.js'
import { AboutAppPage } from '../page-objects/about-app-page.js'

const searchPage = new SearchPage()
const settingsPage = new SettingsPage()
const languageSettingsPage = new LanguageSettingsPage()
const popupPage = new PopupPage()
const aboutAppPage = new AboutAppPage()
const settingsMenuListEnglishText = [enJson['settings-textsize'],
  enJson['settings-about-wikipedia'],
  enJson['settings-privacy'],
  enJson['settings-term'],
  enJson['settings-about-app']]

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

  it('check text size popup', () => {
    languageSettingsPage.selectOptionFromSettings('Text size')
    popupPage.getHeader().should('have.text', enJson['header-textsize'])
    popupPage.getContent().should('have.text', enJson['textsize-decrease'] + enJson['textsize-default'] + enJson['textsize-increase'])
  })

  it('check about app page', () => {
    languageSettingsPage.selectOptionFromSettings('About the app')
    aboutAppPage.getHeader().should('have.text', enJson['about-header'])
    aboutAppPage.getImage().should('have.attr', 'src', '/images/onboarding-0.png')
    aboutAppPage.getVersion().should('have.text', '1.0.0')
    aboutAppPage.getMessage().should('have.text', enJson['about-app-message'])
  })
})
