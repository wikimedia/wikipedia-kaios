import { useState, useEffect, useLayoutEffect } from 'preact/hooks'
import { getLanglinks } from 'api'

export const useSearchArticleLanguage = (lang, title) => {
  const [items, setItems] = useState([])
  const [query, setQuery] = useState()
  const [allLanguages, setAllLanguages] = useState([])

  useEffect(() => {
    getLanglinks(lang, title)
      .then(languages => {
        setAllLanguages(languages)
        setItems(getInitialLangList(languages))
      })
  }, [])

  useLayoutEffect(() => {
    const filteredList = query ? filterFirst10Language(allLanguages, query) : getInitialLangList(allLanguages)
    setItems(filteredList.map(item => {
      item.isSelected = item.lang === lang
      return item
    }))
  }, [query])

  useLayoutEffect(() => {
    setItems(items.map(item => {
      item.isSelected = item.lang === lang
      return item
    }))
  }, [lang])

  return [items, query, setQuery, allLanguages.length]
}

const filterFirst10Language = (languages, text) => {
  const lowerCaseText = text.toLowerCase()
  const foundList = []
  for (let i = 0; foundList.length < 10 && i < languages.length; i++) {
    if (
      languages[i].title.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].autonym.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].description.toLowerCase().indexOf(lowerCaseText) > -1 ||
      languages[i].lang.toLowerCase().indexOf(lowerCaseText) > -1
    ) {
      foundList.push(languages[i])
    }
  }
  return foundList
}

const getInitialLangList = languages => {
  return languages.slice(0, 10)
}
