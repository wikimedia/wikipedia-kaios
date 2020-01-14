import { normalizeTitle } from 'utils'

const defautParams = {
  format: 'json',
  formatversion: 2,
  origin: '*'
}

export const buildMwApiUrl = (lang, params) => {
  params = Object.assign({}, defautParams, params)
  const baseUrl = `https://${lang}.wikipedia.org/w/api.php`
  return baseUrl + '?' + Object.keys(params).map(p => {
    return `${p}=${encodeURIComponent(params[p])}`
  }).join('&')
}

export const buildPcsUrl = (lang, title, endpoint) => {
  const base = `https://${lang}.wikipedia.org`
  const path = `api/rest_v1/page/${endpoint}`
  const page = encodeURIComponent(normalizeTitle(title))
  return `${base}/${path}/${page}`
}
