import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup, useSearchLanguage } from 'hooks'
import { RadioListView } from 'components'
import { setAppLanguage, getAppLanguage } from 'utils'

export const Language = () => {
  const containerRef = useRef()
  const listRef = useRef()

  const i18n = useI18n()
  const [lang, setLang] = useState(getAppLanguage())
  const [items, query, setQuery] = useSearchLanguage(lang)
  const [showLanguagePopup] = usePopup(LanguagePopup)
  const [current, setNavigation, getCurrent] = useNavigation('Language', containerRef, listRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()

    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]

      setLang(item.lang)
      setAppLanguage(item.lang)
      history.back()
    }
  }

  useSoftkey('Language', {
    right: i18n('softkey-search'),
    onKeyRight: () => setNavigation(0),
    center: i18n('centerkey-select'),
    onKeyCenter,
    left: i18n('softkey-cancel'),
    onKeyLeft: () => history.back(),
    onKeyBackspace: !(query && current.type === 'INPUT') && (() => history.back())
  }, [lang, items, current.type])

  useEffect(() => {
    setNavigation(items.findIndex(item => item.isSelected) + 1)
    showLanguagePopup({ i18n })
  }, [])

  return <div class='language' ref={containerRef}>
    <input type='text' placeholder={i18n('search-language-placeholder')} value={query} onInput={e => setQuery(e.target.value)} data-selectable />
    <RadioListView header={i18n('language-change')} items={items} containerRef={listRef} empty={i18n('no-result-found')} />
  </div>
}

const LanguagePopup = ({ close, i18n }) => {
  useSoftkey('LanguageMessage', {
    center: i18n('softkey-ok'),
    onKeyCenter: close,
    onKeyBackspace: () => { close(); history.back() }
  }, [])

  return <div class='language-message'>
    <div class='header'>{i18n('language-setting')}</div>
    <p class='preview-text'>{i18n('language-setting-message')}</p>
  </div>
}
