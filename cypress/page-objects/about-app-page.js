export class AboutAppPage {
  getHeader () {
    return cy.get('div.aboutapp .header')
  }

  getImage () {
    return cy.get('div.aboutapp .image img')
  }

  getVersion () {
    return cy.get('div.aboutapp .version')
  }

  getMessage () {
    return cy.get('div.aboutapp .message>p')
  }
}
