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

  // @todo i18n implemented here
  const items = [
    { title: 'Language' },
    { title: 'Text size' },
    { title: 'About Wikipedia' },
    { title: 'Privacy policy', link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { title: 'Terms of use', link: `https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}` },
    { title: 'Rate the app' },
    { title: 'Help and feedback' },
    { title: 'About the app' }
  ]

  return <div class='page settings'>
    {/* @todo thinking of <Header name='settings'/> */}
    <div class='header'>Settings</div>
    <ListView items={items} containerRef={containerRef} />
  </div>
}
