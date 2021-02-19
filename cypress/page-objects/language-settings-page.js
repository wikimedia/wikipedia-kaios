export class LanguageSettingsPage {
  popupTextElement () {
    return cy.get('.preview-text')
  }

  popupTitleElement () {
    return cy.get('.language-message > .header')
  }

  headerElement () {
    return cy.get('.header')
  }

  selectOptionFromSettings (option) {
    cy
      .get('.item')
      .each(($el, index, $list) => {
        if ($el.attr('data-selected-key') === option) {
          return false
        } else {
          cy.downArrow()
        }
      })
      .then(() => {
        cy.enter()
      })
  }
}
