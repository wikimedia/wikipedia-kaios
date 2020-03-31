import { h } from 'preact'
import { route } from 'preact-router'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { ListView, TextSize } from 'components'
import { getAppLanguage } from 'utils'

export const Settings = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const lang = getAppLanguage()
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

  const onTextsizeSelected = () => {
    const [showTextSize] = usePopup(TextSize)
    showTextSize()
  }

  useSoftkey('Settings', {
    left: i18n('softkey-close'),
    onKeyLeft: () => history.back(),
    center: i18n('centerkey-select'),
    onKeyCenter
  })

  const [, setNavigation, getCurrent] = useNavigation('Settings', containerRef, 'y')

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('settings-language'), path: '/language' },
    { title: i18n('settings-textsize'), action: onTextsizeSelected },
    { title: i18n('settings-about-wikipedia'), path: '/about-wikipedia' },
    { title: i18n('settings-privacy'), link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { title: i18n('settings-term'), link: `https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}` },
    // @todo will have this soon and don't delete it from the language json
    // { title: i18n('settings-rate') },
    // { title: i18n('settings-help-feedback') },
    { title: i18n('settings-about-app'), path: '/about-app' }
  ]

  return <div class='settings'>
    <ListView
      header={i18n('header-settings')}
      items={items}
      containerRef={containerRef}
    />
  </div>
}
