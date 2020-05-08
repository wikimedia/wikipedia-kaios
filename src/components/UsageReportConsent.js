import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { RadioListView } from 'components'
import { getConsentStatus, setConsentStatus } from 'utils'

export const UsageReportConsent = ({ close }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const listRef = useRef()
  const hasConsented = getConsentStatus()
  const [items, setItems] = useState([
    { title: i18n('usage-consent-yes'), isSelected: hasConsented },
    { title: i18n('usage-consent-no'), isSelected: !hasConsented }
  ])
  const [, setNavigation, getCurrent] = useNavigation('UsageReportConsent', containerRef, listRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()
    setItems(items.map((item, i) => {
      item.isSelected = (i === index)
      return item
    }))
    setConsentStatus(index === 0)
  }

  useSoftkey('UsageReportConsent', {
    left: i18n('softkey-done'),
    onKeyLeft: close,
    onKeyBackspace: close,
    center: i18n('centerkey-select'),
    onKeyCenter
  }, [])

  useEffect(() => {
    setNavigation(items.findIndex(item => item.isSelected))
  }, [])

  return (
    <div class='usageconsent' ref={containerRef}>
      <div class='header'>{i18n('usage-consent-header')}</div>
      <div class='body'>
        <div class='message'>
          <p> {i18n('usage-consent-explanation')} </p>
        </div>
        <RadioListView items={items} containerRef={listRef} darkerSelectedBackgroundColor />
      </div>
    </div>
  )
}
