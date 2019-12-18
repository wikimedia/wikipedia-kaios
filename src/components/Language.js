import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { loadMessages } from 'api'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { RadioListView } from 'components'
import { allLanguages } from 'utils'

// @todo replace with all language code
const initialListItem = allLanguages.slice(0, 10).map(language => {
  return {
    lang: language.code,
    title: language.name
  }
})

const filterFirst10Language = text => {
  const foundList = []
  for (let i = 0; foundList.length < 10 && i < allLanguages.length; i++) {
    if (
      allLanguages[i].name.toLowerCase().indexOf(text) > -1 ||
      allLanguages[i].canonical_name.toLowerCase().indexOf(text) > -1
    ) {
      foundList.push({
        lang: allLanguages[i].code,
        title: allLanguages[i].name
      })
    }
  }
  return foundList
}
export const Language = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [lang, setLang] = useState(i18n.locale)
  const [items, setItems] = useState(initialListItem)
  const [query, setQuery] = useState()
  const [showLanguagePopup] = usePopup(languagePopup, { position: 'bottom' })
  const [, setNavigation, getCurrent] = useNavigation('Language', containerRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()

    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]
      // load new language json file
      loadMessages(item.lang).then((messages) => {
        i18n.setLocale(item.lang)
        i18n.load(messages)
        setLang(i18n.locale)
      })

      setItems(items.map((item, index) => {
        item.isSelected = itemIndex === index
        return item
      }))
    }
  }

  useEffect(() => {
    const filteredList = filterFirst10Language(query)
    setItems(filteredList.map(item => {
      item.isSelected = lang === item.lang
      return item
    }))
  }, [query])

  useSoftkey('Language', {
    left: i18n.i18n('done'),
    onKeyLeft: () => history.back(),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  }, [lang, items])

  useEffect(() => {
    // find the current selected language
    setItems(items.map(item => {
      item.isSelected = lang === item.lang
      return item
    }))
    setNavigation(items.findIndex(item => item.isSelected) + 1)
    showLanguagePopup({ i18n })
  }, [])

  return <div class='language'>
    <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value.toLowerCase())} data-selectable />
    <div class='header'>{i18n.i18n('language-change')}</div>
    <RadioListView items={items} containerRef={containerRef} />
  </div>
}

const languagePopup = ({ close, i18n }) => {
  useSoftkey('LanguageMessage', {
    center: i18n.i18n('ok'),
    onKeyCenter: close
  }, [])

  return <div class='language-message'>
    <div class='header'>{i18n.i18n('language-setting')}</div>
    <p class='preview-text'>{i18n.i18n('language-setting-message')}</p>
  </div>
}
