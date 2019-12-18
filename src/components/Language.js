import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { RadioListView } from 'components'

// @todo replace with hi mr code
const initialListItem = [
  { title: 'English (Default)', lang: 'en' },
  { title: 'Spanish', lang: 'es' },
  { title: 'Russian', lang: 'ru' }
]

export const Language = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const lang = i18n.locale
  const [items, setItems] = useState(initialListItem)
  const [showLanguagePopup] = usePopup(languagePopup, { position: 'bottom' })
  const [, setNavigation, getCurrent] = useNavigation('Language', containerRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    i18n.setLocale(item.lang)
    setItems(items.map((item, itemIndex) => {
      item.isSelected = itemIndex === index
      return item
    }))
  }

  useSoftkey('Language', {
    left: i18n.i18n('done'),
    onKeyLeft: () => history.back(),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  })

  useEffect(() => {
    // find the current selected language
    setItems(items.map(item => {
      item.isSelected = lang === item.lang
      return item
    }))
    setNavigation(items.findIndex(item => item.isSelected))
    showLanguagePopup({ i18n })
  }, [])

  return <div class='language'>
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
