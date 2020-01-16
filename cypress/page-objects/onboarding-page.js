export class OnboardingPage {
  getMainImage () {
    return cy.get('.image > img')
  }

  getBackgroundImage () {
    return cy.get('.image')
  }

  getTitle () {
    return cy.get('.title')
  }

  getDescription () {
    return cy.get('.description')
  }
}
