export class AboutWikipediaPage {
  getHeader () {
    return cy.get('div.about-wikipedia .header')
  }

  getImage () {
    return cy.get('div.about-wikipedia .image img')
  }

  getTitle () {
    return cy.get('div.about-wikipedia .title')
  }

  getDescription () {
    return cy.get('div.about-wikipedia .description')
  }
}
