import { buildPcsUrl } from 'utils'

export const getRandomArticleTitle = lang => {
  const url = buildPcsUrl(lang, 'title', 'random')
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.items[0].title
    })
}
