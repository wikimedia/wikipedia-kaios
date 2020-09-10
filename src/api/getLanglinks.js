import {
  buildMwApiUrl, cachedFetch,
  isSupportedForReading, getDirection
} from 'utils'

export const getLanglinks = (lang, title) => {
  const params = {
    action: 'query',
    titles: title,
    prop: 'langlinks',
    lllimit: 500,
    llprop: 'langname|autonym'
  } // todo: find how to pass lang variant
  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, response => {
    const { pages } = response.query
    return pages[0].langlinks
      .filter(item => isSupportedForReading(item.lang))
      .map(item => ({
        title: item.autonym,
        langname: item.langname,
        lang: item.lang,
        description: item.title,
        dir: getDirection(item.lang)
      })
      )
  })
}
