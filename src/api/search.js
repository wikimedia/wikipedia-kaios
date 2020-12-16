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
    prop: 'pageimages',
    generator: 'search',
    list: 'search',
    srprop: 'snippet',
    srsearch: term,
    srlimit: 15,
    srenablerewrites: true,
    srinterwiki: true,
    gsrsearch: term,
    gsrnamespace: 0,
    gsrlimit: 15,
    piprop: 'thumbnail',
    pithumbsize: 64,
    pilimit: 15,
    format: 'json'
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    if (!data.query || !data.query.search) {
      return []
    }
    // data.query.search.sort((a, b) => a.index - b.index)
    return Object.values(data.query.search).map((p) => {
      const page = data.query.pages.find(page => page.pageid === p.pageid)
      return {
        title: p.title,
        titleHtml: p.title,
        description: p.snippet.replace(/<span class="searchmatch">(\w+)<\/span>/g, '$1'),
        imageUrl: page && page.thumbnail && page.thumbnail.source
      }
    })
  })
}
