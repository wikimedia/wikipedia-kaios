/// <reference types="Cypress" />

import * as enJson from '../../i18n/en.json'
import * as nlJson from '../../i18n/nl.json'
import * as ptJson from '../../i18n/pt.json'
import { SettingsPage } from '../page-objects/settings-page'
import { SearchPage } from '../page-objects/search-page'
import { LanguageSettingsPage } from '../page-objects/language-settings-page'

const searchPage = new SearchPage()
const settingsPage = new SettingsPage()
const languageSettingsPage = new LanguageSettingsPage()
const settingsMenuListEnglishText = [enJson['settings-language'],
  enJson['settings-textsize'],
  enJson['settings-about-wikipedia'],
  enJson['settings-privacy'],
  enJson['settings-term'],
  enJson['settings-rate'],
  enJson['settings-help-feedback'],
  enJson['settings-about-app']]
const languageSettingsPopupEnglishText = enJson['language-setting-message']
const languageChangeDutchText = nlJson['language-change']
const settingsMenuListDutchText = [nlJson['settings-language'],
  nlJson['settings-textsize'],
  nlJson['settings-about-wikipedia'],
  nlJson['settings-privacy'],
  nlJson['settings-term'],
  nlJson['settings-rate'],
  nlJson['settings-help-feedback'],
  nlJson['settings-about-app']]

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
    cy.enter()
    languageSettingsPage.popupTitleElement().should('have.text', enJson['language-setting'])

    languageSettingsPage.popupTextElement().should('have.text', languageSettingsPopupEnglishText)
    cy.enter()

    cy.getLeftSoftkeyButton().should('have.text', enJson['softkey-search'])

    cy.downArrow()
    cy.enter()

    languageSettingsPage.headerElement().should('have.text', languageChangeDutchText)

    cy.getRightSoftkeyButton().click()
    settingsPage.settingsList().should('have.text', settingsMenuListDutchText.join(''))
  })

  it('search for language on settings', () => {
    cy.enter()
    cy.enter()
    cy.getLeftSoftkeyButton().click()
    cy.get('div.list').should('not.contain.text', 'Português')
    cy.get('input').type('port')
    cy.get('div.list').should('contain.text', 'Português')
    cy.downArrow()
    cy.enter()
    languageSettingsPage.headerElement().should('have.text', ptJson['language-change'])
  })
})
