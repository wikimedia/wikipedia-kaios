import { cachedFetch, buildMwApiUrl } from 'utils'

export const search = (lang, term) => {
  // fulltext search
  const params = {
    action: 'query',
    list: 'search',
    srprop: 'snippet',
    srsearch: term,
    srlimit: 15,
    srenablerewrites: true,
    srinfo: 'rewrittenquery',
    prop: 'pageimages',
    piprop: 'thumbnail',
    pithumbsize: 64,
    pilimit: 15,
    generator: 'search',
    gsrsearch: term,
    gsrnamespace: 0,
    gsrlimit: 15,
    format: 'json'
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    if (!data.query || !data.query.search) {
      return []
    }

    const { search, pages } = data.query
    return Object.values(search).map(item => {
      const page = pages && pages.find(page => page.pageid === item.pageid)
      return {
        title: item.title,
        description: item.snippet,
        imageUrl: page && page.thumbnail && page.thumbnail.source
      }
    })
  })
}
