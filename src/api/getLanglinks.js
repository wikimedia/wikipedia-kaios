import {
  buildMwApiUrl, cachedFetch,
  isSupportedForReading, getDirection,
  isPrioritized
} from 'utils'

const convertToWikiLang = lang => {
  // The lang link endpoint return 'nb' but the wiki subdomain is 'no'
  return lang === 'nb' ? 'no' : lang
}

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
    const allLanguages = langlinks
      .map(item => {
        return {
          title: item.autonym,
          langname: item.langname,
          lang: convertToWikiLang(item.lang),
          description: item.title,
          dir: getDirection(item.lang)
        }
      })
      .filter(item => isSupportedForReading(item.lang))

    // Sort languages prioritized first, and then
    // in alphabetical order within the prioritized
    // and non-prioritized groups.
    allLanguages.sort((a, b) => {
      const aPrio = isPrioritized(a.lang)
      const bPrio = isPrioritized(b.lang)
      if (aPrio && !bPrio) {
        return 0
      } else if (!aPrio && bPrio) {
        return 1
      } else {
        if (a.lang < b.lang) {
          return -1
        } else if (a.lang > b.lang) {
          return 1
        }
        return 0
      }
    })

    return allLanguages
  })
}
