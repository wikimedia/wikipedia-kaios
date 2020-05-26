import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { ListView } from 'components'
import { goto } from 'utils'

export const PrivacyTerms = ({ close }) => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    if (item.action) {
      item.action()
    }
  }

  useSoftkey('PrivacyTerms', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: close
  })

  const [, setNavigation, getCurrent] = useNavigation('PrivacyTerms', containerRef, listRef, 'y')

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('settings-privacy'), action: goto.privacyPolicy, link: true },
    { title: i18n('settings-term'), action: goto.termsOfUse, link: true }
  ]

  return (
    <div class='privacyterms' ref={containerRef}>
      <ListView
        header={i18n('privacy-terms-header')}
        items={items}
        containerRef={listRef}
      />
    </div>
  )
}
