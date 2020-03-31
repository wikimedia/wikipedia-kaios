import { canonicalizeTitle } from 'utils'

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

export const buildCommonsApiUrl = params => {
  params = Object.assign({}, defautParams, params)
  const baseUrl = 'https://commons.wikimedia.org/w/api.php'
  return baseUrl + '?' + Object.keys(params).map(p => {
    return `${p}=${encodeURIComponent(params[p])}`
  }).join('&')
}

export const buildWpMobileWebUrl = (lang, title) => {
  const page = encodeURIComponent(canonicalizeTitle(title))
  return `https://${lang}.m.wikipedia.org/w/index.php?title=${page}`
}

export const buildPcsUrl = (lang, title, endpoint) => {
  const base = `https://${lang}.wikipedia.org`
  const path = `api/rest_v1/page/${endpoint}`
  const page = encodeURIComponent(canonicalizeTitle(title))
  return `${base}/${path}/${page}`
}
