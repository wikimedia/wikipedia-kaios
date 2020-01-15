export class OnboardingPage {
  getImage () {
    return cy.get('.image > img')
  }

  getTitle () {
    return cy.get('.title')
  }

  getDescription () {
    return cy.get('.description')
  }
}
