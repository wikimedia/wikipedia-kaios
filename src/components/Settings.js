import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useLanguage, useSoftkey } from 'hooks'
import { ListView } from 'components'

export const Settings = () => {
  const containerRef = useRef()
  const i18n = useI18n()
  const lang = useLanguage()
  const softkey = useSoftkey()

  const [, setNavigation] = useNavigation(containerRef, 'y')

  useEffect(() => {
    setNavigation(0)
    softkey.dispatch({ type: 'setLeftText', value: '' })
    softkey.dispatch({ type: 'setRightText', value: i18n.i18n('close') })
    softkey.dispatch({ type: 'setOnKeyRight', event: () => history.back() })
    softkey.dispatch({ type: 'setCenterText', value: i18n.i18n('centerkey-select') })
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
  }, [])

  const onKeyCenter = () => {
    // @todo different action depending on the selected item
  }

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

  return <div class='page settings'>
    {/* @todo thinking of <Header name='settings'/> */}
    <div class='header'>Settings</div>
    <ListView items={items} containerRef={containerRef} />
  </div>
}
