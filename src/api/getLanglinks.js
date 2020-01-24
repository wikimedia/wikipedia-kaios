import { buildPcsUrl, cachedFetch } from 'utils'

export const getLanglinks = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'metadata')
  return cachedFetch(url, response => {
    return response.language_links.map(item => (
      {
        title: item.lang,
        lang: item.lang,
        description: item.titles.normalized
      }
    )
    )
  })
}
