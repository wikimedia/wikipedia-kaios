/// <reference types="Cypress" />


import { SettingsPage } from "../page-objects/settings-page"

const settingsPage = new SettingsPage()

describe('Article search', () =>{
  beforeEach(() =>{
    cy.navigateToHomePage()
    cy.clickSettingsButton()
  })

  it('settings menu should show all buttons', () => {
    settingsPage.settingsList().should('have.text', "LanguageText sizeAbout WikipediaPrivacy policyTerms of useRate the appHelp and feedbackAbout the app")
  })
  //TODO: create test checking for each button/link
  //TODO: create test checking for select line and using arrows to change and assert the change
  //TODO: 
})
