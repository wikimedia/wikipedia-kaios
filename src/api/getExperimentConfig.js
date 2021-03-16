import { buildMwOrgApiUrl, cachedFetch } from 'utils'

export const getExperimentConfig = () => {
  const titles = 'Wikipedia_for_KaiOS/engagement1'
  const params = {
    action: 'query',
    prop: 'revisions',
    titles,
    rvslots: 'main',
    rvprop: 'content'
  }

  const url = buildMwOrgApiUrl(params)
  return cachedFetch(url, data => {
    const page = data.query.pages[0]
    if (page.missing) {
      return {}
    }
    try {
      return JSON.parse(page.revisions[0].slots.main.content)
    } catch (e) {
      console.warn('Error fetching the experiment config', e, JSON.stringify(data))
      return {}
    }
  })
}
