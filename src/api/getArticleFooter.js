import { buildMwApiUrl } from 'utils'

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
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.query.pages
    })
}
