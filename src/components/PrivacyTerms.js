import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { ListView, UsageReportConsent } from 'components'
import { getAppLanguage } from 'utils'

export const PrivacyTerms = ({ close }) => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const lang = getAppLanguage()
  const [showUsageReportConsent] = usePopup(UsageReportConsent, { mode: 'fullscreen', stack: true })

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]

    // open link
    if (item.link) {
      window.open(item.link)
    } else if (item.action) {
      item.action()
    }
  }

  const onUsageReportConsentSelected = () => {
    showUsageReportConsent()
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
    { title: i18n('settings-usage-reports'), action: onUsageReportConsentSelected },
    { title: i18n('settings-privacy'), link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { title: i18n('settings-term'), link: `https://foundation.m.wikimedia.org/wiki/Terms_of_Use/${lang}` }
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
