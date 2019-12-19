import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { loadMessages } from 'api'
import { useNavigation, useI18n, useSoftkey, usePopup, useSearchLanguage } from 'hooks'
import { RadioListView } from 'components'

export const Language = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [lang, setLang] = useState(i18n.locale)
  const [items, query, setQuery] = useSearchLanguage(lang)
  const [showLanguagePopup] = usePopup(LanguagePopup, { position: 'bottom' })
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
        localStorage.setItem('language-app', item.lang)
      })
    }
  }

  useSoftkey('Language', {
    left: i18n.i18n('done'),
    onKeyLeft: () => history.back(),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter,
    right: i18n.i18n('search'),
    onKeyRight: () => setNavigation(0)
  }, [lang, items])

  useEffect(() => {
    setNavigation(items.findIndex(item => item.isSelected) + 1)
    showLanguagePopup({ i18n })
  }, [])

  return <div class='language'>
    <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value.toLowerCase())} data-selectable />
    <div class='header'>{i18n.i18n('language-change')}</div>
    <RadioListView items={items} containerRef={containerRef} />
  </div>
}

const LanguagePopup = ({ close, i18n }) => {
  useSoftkey('LanguageMessage', {
    center: i18n.i18n('ok'),
    onKeyCenter: close
  }, [])

  return <div class='language-message'>
    <div class='header'>{i18n.i18n('language-setting')}</div>
    <p class='preview-text'>{i18n.i18n('language-setting-message')}</p>
  </div>
}
