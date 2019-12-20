
export const getRandomArticleTitle = lang => {
  const baseUrl = `https://${lang}.wikipedia.org/w/api.php`
  const params = {
    action: 'query',
    format: 'json',
    formatversion: 2,
    origin: '*',
    list: 'random',
    rnnamespace: 0,
    rnlimit: 1
  }
  const url = baseUrl + '?' + Object.keys(params).map(p => `${p}=${params[p]}`).join('&')
  return fetch(url)
    .then(response => response.json())
    .then(data => {
      return data.query.random[0].title
    })
}
