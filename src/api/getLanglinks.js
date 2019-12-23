import { buildMwApiUrl, cachedFetch } from 'utils'

export const getLanglinks = (lang, title) => {
  const params = {
    action: 'query',
    titles: title,
    prop: 'langlinks',
    lllimit: 500,
    llprop: 'langname'
  }
  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url)
    .then(response => {
      const { pages } = response.query
      return pages[0].langlinks
    })
}
