import { buildPcsUrl, cachedFetch } from 'utils'

export const getRandomArticleTitle = lang => {
  const url = buildPcsUrl(lang, 'title', 'random')

  return cachedFetch(url, data => data.items[0].title, false)
}
