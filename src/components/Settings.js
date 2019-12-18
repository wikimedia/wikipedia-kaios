import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const Settings = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const lang = i18n.locale
  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    // open link
    if (item && item.link) {
      window.open(item.link)
    }
  }
  useSoftkey('Settings', {
    right: i18n.i18n('close'),
    onKeyRight: () => history.back(),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  })

  const [, setNavigation, getCurrent] = useNavigation('Settings', containerRef, 'y')

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n.i18n('settings-language') },
    { title: i18n.i18n('settings-textsize') },
    { title: i18n.i18n('settings-about-wikipedia') },
    { title: i18n.i18n('settings-privacy'), link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { title: i18n.i18n('settings-term'), link: `https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}` },
    { title: i18n.i18n('settings-rate') },
    { title: i18n.i18n('settings-help-feedback') },
    { title: i18n.i18n('settings-about-app') }
  ]

  return <div class='settings'>
    {/* @todo thinking of <Header name='settings'/> */}
    <div class='header'>Settings</div>
    <ListView items={items} containerRef={containerRef} />
  </div>
}
