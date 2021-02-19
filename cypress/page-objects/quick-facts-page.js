export class QuickFactsPage {
  table () {
    return cy.get('div.quickfacts>table.infobox.biota')
  }
}
