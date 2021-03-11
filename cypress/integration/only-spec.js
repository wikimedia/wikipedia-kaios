/// <reference types="Cypress" />

import { ArticlePage } from '../page-objects/article-page'
import { QuickFactsPage } from '../page-objects/quick-facts-page'
import { PopupPage } from '../page-objects/popup-page'
import { ArticleMenuPage } from '../page-objects/article-menu-page'
import { SearchPage } from '../page-objects/search-page'
import { OnboardingPage } from '../page-objects/onboarding-page'
import { SettingsPage } from '../page-objects/settings-page'
import { LanguageSettingsPage } from '../page-objects/language-settings-page'
import { AboutAppPage } from '../page-objects/about-app-page.js'
import { AboutWikipediaPage } from '../page-objects/about-wikipedia-page.js'
import { TipsPage } from '../page-objects/tips-page'
import * as enJson from '../../i18n/en.json'
import * as ptJson from '../../i18n/pt.json'
import * as nlJson from '../../i18n/nl.json'

const articlePage = new ArticlePage()
const quickFactsPage = new QuickFactsPage()
const popupPage = new PopupPage()
const articleMenuPage = new ArticleMenuPage()
const searchPage = new SearchPage()
const onboardingPage = new OnboardingPage()
const tipsPage = new TipsPage()
const settingsPage = new SettingsPage()
const languageSettingsPage = new LanguageSettingsPage()
const aboutAppPage = new AboutAppPage()
const aboutWikipediaPage = new AboutWikipediaPage()
const settingsMenuListEnglishText = [enJson['settings-language'], enJson['settings-help-feedback'], enJson['settings-about-wikipedia'], enJson['settings-about-app'], enJson['settings-privacy-terms']]
const languageSettingsPopupEnglishText = enJson['language-setting-message']
const settingsMenuListDutchText = [nlJson['settings-language'], nlJson['settings-help-feedback'], nlJson['settings-about-wikipedia'], nlJson['settings-about-app'], nlJson['settings-privacy-terms']]
const tipsMenuListEnglishText = [enJson['tips-read'], enJson['tips-search'], enJson['tips-switch'], enJson['tips-about']]

function goToCatArticle () {
  cy.navigateToPageWithoutOnboarding('article/en/Cat')
  articlePage.title().should('have.text', 'Cat')
}

describe('Article view', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('change article language', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('português')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    articlePage.title().should('have.text', 'Gato')
  })

  it('check footer', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Suggested_articles')
    articlePage.footerTitle().should('have.text', enJson['suggested-articles'])
    articlePage.recommendationsList().should('have.length', 3)
    cy.downArrow()
    articlePage.footerImage().should('exist')
    articlePage.footerLicense().should('exist')
      .should('exist')
  })

  it('check footer changes language', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('languages')
    cy.get('input').type('português')
    cy.get('.description').should('have.text', 'Gato')
    cy.downArrow().enter()
    articlePage.title().should('have.text', 'Gato')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Artigos_sugeridos')
    articlePage.footerTitle().should('have.text', ptJson['suggested-articles'])
  })

  it('check image gallery', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('gallery')
    articlePage.galleryImage().should('be.visible')
    articlePage.galleryImage().invoke('attr', 'src').then((src) => {
      cy.rightArrow()
      articlePage.galleryImage().should('not.have.attr', 'src', src)
    })
    cy.enter()
    articlePage.galleryPopupHeader().should('be.visible')
    cy.getRightSoftkeyButton().should('have.text', enJson['softkey-more-info'])
  })

  it('check quick facts opens', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('quickfacts')
    quickFactsPage.table().should('contains.text', 'Various types of the domestic cat')
    cy.clickCloseButton()
    articlePage.selectOptionFromArticleMenu('Quick Facts')
    quickFactsPage.table().should('contains.text', 'Various types of the domestic cat')
  })

  it('check quick facts link opens', () => {
    goToCatArticle()
    articlePage.selectOptionFromActionsMenu('quickfacts')
    quickFactsPage.table().get('div a ').should('contain.text', 'Conservation status')
    cy.rightArrow().enter()
    popupPage.getTitle().should('have.text', 'Conservation status')
    cy.enter()
    articlePage.title().should('have.text', 'Conservation status')
    cy.clickMenuButton().click()
    articleMenuPage.getPreviousArticleName().should('have.text', 'Cat')
    articleMenuPage.selectOptionFromArticleMenu('Previous article')
    articlePage.title().should('have.text', 'Cat')
  })

  it('check text size change', () => {
    goToCatArticle()
    articlePage.selectOptionFromArticleMenu('Text size')
    popupPage.getHeader().should('have.text', enJson['header-textsize'])
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    cy.downArrow(3)
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.rightArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.rightArrow(4)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '20px')
  })

  it('check text size remains after switching sections', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Cats_by_location')
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after new search', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromArticleMenu('Search Wikipedia')
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after going to new article', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    cy.rightArrow().enter()
    popupPage.getText().should('have.css', 'font-size', '14px')
    cy.enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check text size remains after changing on preview', () => {
    goToCatArticle()
    articlePage.getArticleText().should('have.css', 'font-size', '16px')
    articlePage.selectOptionFromArticleMenu('Text size')
    cy.leftArrow(2)
    cy.getCenterSoftkeyButton().click()
    cy.downArrow().enter()
    popupPage.getText().should('have.css', 'font-size', '14px')
    cy.enter()
    articlePage.getArticleText().should('have.css', 'font-size', '14px')
  })

  it('check down arrow to hint user to use dpad down', () => {
    goToCatArticle()
    articlePage.getDownArrowIndicator().should('be.visible')
    cy.downArrow()
    articlePage.getDownArrowIndicator().should('not.be.visible')
  })

  it('check down arrow doesnt show', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Catt')
    articlePage.title().should('have.text', 'Catt')
    articlePage.getDownArrowIndicator().should('not.exist')
    cy.downArrow()
    articlePage.getDownArrowIndicator().should('not.exist')
  })

  it('check table is showing', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Dynamics_(music)')
    articlePage.title().should('have.text', 'Dynamics (music)')
    articlePage.selectOptionFromActionsMenu('sections')
    articleMenuPage.selectOptionFromSections('Dynamic_markings')
    cy.rightArrow()
    cy.get('table.wikitable>caption>b').should('have.text', 'More Information:')
    cy.enter()
    cy.get('div.popup-content.fullscreen').should('be.visible')
    cy.get('div.popup-content.fullscreen tr>th').should('be.visible')
  })
})

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

describe('Article search', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('search should show results', () => {
    cy.intercept('/api.php', { fixture: 'catt-search.json' })
    searchPage.search('catt')
    searchPage.results().first()
      .should('exist')
  })

  it('results with image should show image', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('results without image should not show image', () => {
    cy.intercept('/api.php', { fixture: 'helena-catt-search.json' })
    searchPage.search('Helena Catt')
    searchPage.results().first()
      .children().first().next().should('not.exist')
  })

  it('article should open from search results page', () => {
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cattle')
  })

  it('back button should take us to search page with results', () => {
    cy.intercept('/api.php', { fixture: 'cattle-search.json' })
    searchPage.search('cattle')
    searchPage.results().first()
    cy.enter().downArrow().enter()
    articlePage.title().should('have.text', 'Cattle')
    cy.clickCloseButton()
    searchPage.results().first()
      .children().first().next().should('have.class', 'img')
  })

  it('should show empty result found when search for "adf23cv111111"', () => {
    searchPage.search('adf23cv111111')
    searchPage.getEmptyContent().should('have.text', enJson['no-result-found'])
  })

  it('center softkey should change when focus on result and search input', () => {
    cy.intercept('/api.php', { fixture: 'cat-search.json' })
    searchPage.search('cat')
    cy.getCenterSoftkeyButton().should('not.have.text')
    searchPage.results().first()
    cy.wait(500)
    cy.downArrow()
    cy.getCenterSoftkeyButton().should('have.text', enJson['centerkey-select'])
    cy.upArrow()
    cy.getCenterSoftkeyButton().should('not.have.text')
  })
})

describe('references', () => {
  beforeEach(() => {
    cy.navigateToHomePage()
  })

  it('check preview for references opens', () => {
    goToCatArticle()
    cy.downArrow()
    cy.downArrow()
    cy.enter()
    cy.get('div.ref-title').should('be.visible')
  })
})

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
    aboutAppPage.getImage().should('have.attr', 'src', 'images/onboarding-0.png')
    aboutAppPage.getVersion().should('contain', '0.0.0')
    aboutAppPage.getMessage().should('have.text', enJson['about-app-message'])
  })

  it('check about wikipedia page', () => {
    languageSettingsPage.selectOptionFromSettings('About Wikipedia')
    aboutWikipediaPage.getHeader().should('have.text', enJson['about-wikipedia-header'])
    aboutWikipediaPage.getImage().should('have.attr', 'src', 'images/onboarding-0.png')
    aboutWikipediaPage.getTitle().should('have.text', enJson['onboarding-0-title'])
    aboutWikipediaPage.getDescription().should('have.text', enJson['onboarding-0-description'])
    cy.getRightSoftkeyButton().click()

    aboutWikipediaPage.getImage().should('have.attr', 'src', 'images/onboarding-1.png')
    aboutWikipediaPage.getTitle().should('have.text', enJson['onboarding-1-title'])
    aboutWikipediaPage.getDescription().should('have.text', enJson['onboarding-1-description'])
    cy.getRightSoftkeyButton().click()

    aboutWikipediaPage.getImage().should('have.attr', 'src', 'images/onboarding-2.png')
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
    aboutWikipediaPage.getImage().should('have.attr', 'src', 'images/onboarding-1.png')
    cy.getRightSoftkeyButton().click()
    cy.getCenterSoftkeyButton().should('have.text', enJson['softkey-close'])
    cy.getCenterSoftkeyButton().click()
    cy.get('.item>.info>.title').first().should('have.text', enJson['settings-language'])
  })
})

describe('special cases tests', () => {
  it('special page article should open', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Help%3AIPA%2FEnglish')
    articlePage.title().should('have.text', 'Help:IPA/English')
    cy.get('.article-content').should('contain.text', 'Throughout Wikipedia, the pronunciation of words is indicated by means of the ')
  })

  it('languages option should not be available for article in one single language', () => {
    cy.navigateToPageWithoutOnboarding('article/pt/Bruscos')
    articlePage.title().should('have.text', 'Bruscos')
    articlePage.getActionsSectionButton('languages').should('not.exist')
    cy.clickMenuButton()
    articleMenuPage.getMenuOption('Language').should('not.exist')
  })

  it('gallery opens from a non-english article', () => {
    cy.navigateToPageWithoutOnboarding('article/pl/Tupolew_Tu-154/Użytkownicy[24]')
    cy.wait(500)
    articlePage.title().should('have.text', 'Użytkownicy[24]')
    cy.rightArrow()
    cy.enter()
    cy.get('.gallery-view>.img>img').should('be.visible').should('have.attr', 'src', 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e1/Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg/640px-Tupolev_Tu-154B%2C_Tarom_AN0679876.jpg')
  })

  it('check goto quickfacts holly', () => {
    cy.navigateToPageWithoutOnboarding('article/en/Holly')
    articlePage.title().should('have.text', 'Holly')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    Cypress._.times(20, (i) => {
      cy.downArrow()
    })
    cy.leftArrow()
    cy.enter()
    cy.get('.info').should('have.text', 'Go to Section "Selected species"')
    cy.getRightSoftkeyButton().click()
    cy.get('.title').should('have.text', 'Selected species')
  })

  it('check goto quickfacts C', () => {
    cy.navigateToPageWithoutOnboarding('article/en/C')
    articlePage.title().should('have.text', 'C')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    cy.get('div.quickfacts table.infobox').should('be.visible')
    cy.enter()
    cy.get('.info').should('have.text', 'Go to Section "Related characters"')
    cy.getRightSoftkeyButton().click()
    cy.get('.title').should('have.text', 'Related characters')
  })

  it('backspace on popup', () => {
    cy.navigateToPageWithoutOnboarding('article/en/C')
    articlePage.title().should('have.text', 'C')
    articlePage.selectOptionFromActionsMenu('quickfacts')
    cy.get('div.quickfacts table.infobox').should('be.visible')
    cy.get('a[data-selected=true][href="#Related_characters"]').should('exist')
    cy.enter()
    cy.get('div.info').should('have.text', 'Go to Section "Related characters"')
    cy.backspace()
    cy.get('div.info').should('not.exist')
    cy.get('div.quickfacts table.infobox').should('be.visible')
  })
})

describe('Tips page', () => {
  var firstElementOfTheTipsMenuList
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
