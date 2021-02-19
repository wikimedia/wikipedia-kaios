import { buildMwOrgApiUrl, cachedFetch } from 'utils' // , isProd

// const pad = str => {
//   str = String(str)
//   return (str.length === 1 ? '0' : '') + str
// }

const getExperimentData = (prefix, lang) => {
  // const date = new Date()
  // const dateStr = isProd()
  //   ? date.getFullYear() + '-' + pad(date.getMonth() + 1) + '-' + pad(date.getDate())
  //   : '2021-01-01'
  const params = {
    action: 'query',
    prop: 'revisions',
    titles: `${prefix}/${lang}/2021-01-01`,
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

export const getTrendingArticles = lang => {
  return getExperimentData('Wikipedia_for_KaiOS/engagement1/trending', lang)
}

export const getTopicsArticles = lang => {
  return getExperimentData('Wikipedia_for_KaiOS/engagement1/topics', lang)
}
