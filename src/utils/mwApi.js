const defautParams = {
  format: 'json',
  formatversion: 2,
  origin: '*'
}

export const buildMwApiUrl = (lang, params) => {
  params = Object.assign({}, defautParams, params)
  const baseUrl = `https://${lang}.m.wikipedia.org/w/api.php`
  return baseUrl + '?' + Object.keys(params).map(p => {
    return `${p}=${encodeURIComponent(params[p])}`
  }).join('&')
}
