import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup, useSearchLanguage } from 'hooks'
import { RadioListView } from 'components'
import { setAppLanguage } from 'utils'

export const Language = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [lang, setLang] = useState(i18n.locale)
  const [items, query, setQuery] = useSearchLanguage(lang)
  const [showLanguagePopup] = usePopup(LanguagePopup)
  const [, setNavigation, getCurrent] = useNavigation('Language', containerRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()

    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]

      i18n.setLocale(item.lang)
      setLang(i18n.locale)
      setAppLanguage(item.lang)
    }
  }

  useSoftkey('Language', {
    right: i18n.i18n('softkey-search'),
    onKeyRight: () => setNavigation(0),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter,
    left: i18n.i18n('softkey-done'),
    onKeyLeft: () => history.back()
  }, [lang, items])

  useEffect(() => {
    setNavigation(items.findIndex(item => item.isSelected) + 1)
    showLanguagePopup({ i18n })
  }, [])

  return <div class='language'>
    <input type='text' placeholder={i18n.i18n('search-language-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
    <RadioListView header={i18n.i18n('language-change')} items={items} containerRef={containerRef} empty={i18n.i18n('no-result-found')} />
  </div>
}

const LanguagePopup = ({ close, i18n }) => {
  useSoftkey('LanguageMessage', {
    center: i18n.i18n('softkey-ok'),
    onKeyCenter: close
  }, [])

  return <div class='language-message'>
    <div class='header'>{i18n.i18n('language-setting')}</div>
    <p class='preview-text'>{i18n.i18n('language-setting-message')}</p>
  </div>
}
