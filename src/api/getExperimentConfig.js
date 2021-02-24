import { buildMwOrgApiUrl, cachedFetch } from 'utils'

export const getExperimentConfig = () => {
  const prefix = 'Wikipedia_for_KaiOS/engagement1'
  const params = {
    action: 'query',
    prop: 'revisions',
    titles: prefix,
    rvslots: 'main',
    rvprop: 'content'
  }

  const url = buildMwOrgApiUrl(params)
  return cachedFetch(url, data => {
    const page = data.query.pages[0]
    if (page.missing) {
      return []
    }
    return JSON.parse(page.revisions[0].slots.main.content)
  })
}
