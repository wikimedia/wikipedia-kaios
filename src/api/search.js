import { cachedFetch, buildMwApiUrl } from 'utils'

export const search = (lang, term) => {
  const params = {
    action: 'query',
    prop: ['description', 'pageimages', 'pageprops'].join('|'),
    piprop: 'thumbnail',
    pilimit: 15,
    ppprop: 'displaytitle',
    generator: 'prefixsearch',
    redirects: true,
    pithumbsize: 64,
    gpslimit: 15,
    gpsnamespace: 0,
    gpssearch: term.replace(/:/g, ' ')
  }
  const url = buildMwApiUrl(lang, params)
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
  }, true)
}
