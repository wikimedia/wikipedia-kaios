/// <reference types="Cypress" />


import { SettingsPage } from "../page-objects/settings-page"
import { SearchPage } from "../page-objects/search-page"
import { LanguageSettingsPage } from "../page-objects/language-settings-page"

const searchPage = new SearchPage()
const settingsPage = new SettingsPage()
const languageSettingsPage = new LanguageSettingsPage()


describe('settings page', () =>{
  var firstElementOfTheSettingsMenuList
  beforeEach(() =>{
    cy.navigateToHomePage()
    searchPage.navigateToSettingsPage()
    firstElementOfTheSettingsMenuList = settingsPage.settingsList().children().first()
  })

  it('show all the items in the list', () => {
    settingsPage.settingsList().should('have.text', 
    "LanguageText sizeAbout WikipediaPrivacy policyTerms of useRate the appHelp and feedbackAbout the app")
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
    languageSettingsPage.popupTitleElement().should('have.text', 'Language settings')

    languageSettingsPage.popupTextElement().should('have.text', 'Changing the language here will change the language throughout the app. You can also change the language on each article using the article menu.')
    cy.enter()

    cy.get('.left').should('have.text', 'Search')
    
    cy.downArrow()
    cy.enter()

    languageSettingsPage.headerElement().should('have.text', 'Programmataal wijzigen')

    cy.get('.right').click()
    settingsPage.settingsList().should('have.text', 
    "TaalTekstgrootteOver WikipediaPrivacybeleidGebruiksvoorwaardenApp beoordelenHulp en feedbackOver de app")
  })

})
