import { useState, useLayoutEffect } from 'preact/hooks'
import { allLanguages } from 'utils'

export const useSearchLanguage = (lang) => {
  const [items, setItems] = useState(getInitialLangList(lang))
  const [query, setQuery] = useState()

  useLayoutEffect(() => {
    const filteredList = query ? filterFirst10Language(query) : getInitialLangList(lang)
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

  return [items, query, setQuery]
}

const filterFirst10Language = text => {
  const lowerCaseText = text.toLowerCase()
  const foundList = []
  for (let i = 0; foundList.length < 10 && i < allLanguages.length; i++) {
    if (
      allLanguages[i].title.toLowerCase().indexOf(lowerCaseText) > -1 ||
      allLanguages[i].canonicalName.toLowerCase().indexOf(lowerCaseText) > -1 ||
      allLanguages[i].lang.toLowerCase().indexOf(lowerCaseText) > -1
    ) {
      foundList.push(allLanguages[i])
    }
  }
  return foundList
}

const getInitialLangList = lang => {
  const list = allLanguages.slice(0, 10)

  if (!list.find(language => language.lang === lang)) {
    list.unshift(allLanguages.find(language => language.lang === lang))
  }

  return list
}
