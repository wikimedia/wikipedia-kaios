import { buildMwOrgApiUrl, cachedFetch } from 'utils'

export const getTrendingArticles = (lang, country) => {
  const title = `Wikipedia_for_KaiOS/engagement1/trending/${lang}/${country.toLowerCase()}`
  const params = {
    action: 'query',
    prop: 'revisions',
    titles: title,
    rvslots: 'main',
    rvprop: 'content'
  }
  const url = buildMwOrgApiUrl(params)
  return cachedFetch(url, data => {
    const page = data.query.pages[0]
    if (page.missing) {
      return []
    }
    return JSON.parse(page.revisions[0].slots.main.content).slice(0, 5)
  })
}
