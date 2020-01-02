import { buildMwApiUrl, cachedFetch } from 'utils'

export const getArticleFooter = (lang, title) => {
  const params = {
    action: 'query',
    prop: 'pageimages|description',
    piprop: 'thumbnail',
    pithumbsize: 160,
    pilimit: 3,
    generator: 'search',
    gsrsearch: `morelike:${title}`,
    gsrnamespace: 0,
    gsrlimit: 3,
    gsrqiprofile: 'classic_noboostlinks',
    uselang: 'content'
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => data.query.pages)
}
