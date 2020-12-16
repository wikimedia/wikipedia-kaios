import { cachedFetch, buildMwApiUrl } from 'utils'

export const search = (lang, term) => {
  // fulltext search
  const params = {
    action: 'query',
    prop: 'pageimages',
    generator: 'search',
    list: 'search',
    srprop: 'snippet',
    srsearch: term,
    srlimit: 15,
    srenablerewrites: true,
    srinfo: 'rewrittenquery',
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
