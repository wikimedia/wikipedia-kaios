import { h } from 'preact'
import { route } from 'preact-router'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { ListView, AboutApp, AboutWikipedia, PrivacyTerms, Feedback } from 'components'
import { goto } from 'utils'

export const Settings = () => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [showAboutApp] = usePopup(AboutApp, { mode: 'fullscreen' })
  const [showAboutWikipedia] = usePopup(AboutWikipedia, { mode: 'fullscreen' })
  const [showFeedback] = usePopup(Feedback, { mode: 'fullscreen' })
  const [showPrivacyTerms] = usePopup(PrivacyTerms, { mode: 'fullscreen' })

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    // open link
    if (item.link) {
      window.open(item.link)
    } else if (item.path) {
      route(item.path)
    } else if (item.action) {
      item.action()
    }
  }

  const onAboutAppSelected = () => {
    showAboutApp()
  }

  const onAboutWikipediaSelected = () => {
    showAboutWikipedia()
  }

  const onFeedbackSelected = () => {
    showFeedback()
  }

  const onPrivacyTermsSelected = () => {
    showPrivacyTerms()
  }

  useSoftkey('Settings', {
    left: i18n('softkey-close'),
    onKeyLeft: () => goto.back(),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: () => goto.back()
  })

  const [, setNavigation, getCurrent] = useNavigation('Settings', containerRef, listRef, 'y')

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('settings-language'), path: '/language' },
    { title: i18n('settings-help-feedback'), action: onFeedbackSelected },
    { title: i18n('settings-about-wikipedia'), action: onAboutWikipediaSelected },
    // @todo will have this soon and don't delete it from the language json
    // { title: i18n('settings-rate') },
    { title: i18n('settings-about-app'), action: onAboutAppSelected },
    { title: i18n('settings-privacy-terms'), action: onPrivacyTermsSelected }
  ]

  return <div class='settings' ref={containerRef}>
    <ListView
      header={i18n('header-settings')}
      items={items}
      containerRef={listRef}
    />
  </div>
}
