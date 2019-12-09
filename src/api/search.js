import { cachedFetch } from 'utils'

export const search = (lang, term) => {
  const baseUrl = `https://${lang}.wikipedia.org/w/api.php`
  const params = {
    action: 'query',
    format: 'json',
    formatversion: 2,
    origin: '*',
    prop: ['description', 'pageimages', 'pageprops'].join('|'),
    piprop: 'thumbnail',
    pilimit: 15,
    ppprop: 'displaytitle',
    generator: 'prefixsearch',
    pithumbsize: 64,
    gpslimit: 15,
    gpsnamespace: 0,
    gpssearch: term
  }
  const url = baseUrl + '?' + Object.keys(params).map(p => `${p}=${params[p]}`).join('&')
  return cachedFetch(url, data => {
    if (!data.query || !data.query.pages) {
      return []
    }
    data.query.pages.sort((a, b) => a.index - b.index)
    return Object.values(data.query.pages).map((p) => {
      return {
        title: p.title,
        titleHtml: p.title.replace(term, `<span class="searchmatch">${term}</span>`),
        description: p.description,
        imageUrl: p.thumbnail && p.thumbnail.source
      }
    })
  })
}
