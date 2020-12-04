import {
  buildMwApiUrl, cachedFetch,
  isSupportedForReading, getDirection,
  prioritizedList
} from 'utils'

export const getLanglinks = (lang, title) => {
  const params = {
    action: 'query',
    titles: title,
    prop: 'langlinks',
    lllimit: 500,
    llprop: 'langname|autonym'
  }
  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, response => {
    const { pages } = response.query
    const langlinks = pages[0].langlinks
    const prioritizedLanguages = langlinks
      .filter(item => {
        return prioritizedList.indexOf(item.lang) !== -1 && isSupportedForReading(item.lang)
      })
      .map(item => {
        return {
          title: item.autonym,
          langname: item.langname,
          lang: item.lang,
          description: item.title,
          dir: getDirection(item.lang)
        }
      })
    const allLanguages = prioritizedLanguages.concat(
      langlinks
        .filter(item => {
          return isSupportedForReading(item.lang) && prioritizedList.indexOf(item.lang) === -1
        })
        .map(item => {
          return {
            title: item.autonym,
            langname: item.langname,
            lang: item.lang,
            description: item.title,
            dir: getDirection(item.lang)
          }
        })
    )

    return allLanguages
  })
}
