/// <reference types="Cypress" />


import { SettingsPage } from "../page-objects/settings-page"
import { SearchPage } from "../page-objects/search-page"

const searchPage = new SearchPage()
const settingsPage = new SettingsPage()


describe('settings page', () =>{
  var firstElementOfTheSettingsMenuList
  beforeEach(() =>{
    cy.navigateToHomePage()
    searchPage.navigateToSettingsPage()
    firstElementOfTheSettingsMenuList = settingsPage.settingsList().children().first()
  })

  it('show all the items in the list', () => {
    settingsPage.settingsList().should('have.text', "LanguageText sizeAbout WikipediaPrivacy policyTerms of useRate the appHelp and feedbackAbout the app")
  })
  
  it('down arrow changes selection', () => {
    firstElementOfTheSettingsMenuList.should('have.attr', 'nav-selected', 'true')

    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'false')

    cy.downArrow()

    settingsPage.settingsList().children().first().should('have.attr', 'nav-selected', 'false')

    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'true')
  })

  it('only the first element should be selected on load', () => {
    firstElementOfTheSettingsMenuList.should('have.attr', 'nav-selected', 'true')

    firstElementOfTheSettingsMenuList.next().should('have.attr', 'nav-selected', 'false')
  })

})
