import { cachedFetch, buildMwApiUrl } from 'utils'

export const search = (lang, term) => {
  // prefix search
  /*
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
  */

  // fulltext search
  // https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=no%20result%20page&format=json
  const params = {
    action: 'query',
    srprop: 'snippet',
    srlimit: 15,
    list: 'search',
    srsearch: term.replace(/:/g, ' '),
    format: 'json'
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    if (!data.query || !data.query.search) {
      return []
    }
    // data.query.search.sort((a, b) => a.index - b.index)
    return Object.values(data.query.search).map((p) => {
      return {
        title: p.title,
        titleHtml: p.title,
        description: p.snippet.replaceAll(/<span class="searchmatch">(\w+)<\/span>/g, '$1')
        // imageUrl: p.thumbnail && p.thumbnail.source
      }
    })
  })
}
