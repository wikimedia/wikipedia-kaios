import { buildMwApiUrl } from 'utils'

export const getRandomArticleTitle = lang => {
  const params = {
    action: 'query',
    list: 'random',
    rnnamespace: 0,
    rnlimit: 1
  }
  const url = buildMwApiUrl(lang, params)
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.query.random[0].title
    })
}
