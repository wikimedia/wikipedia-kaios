import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey } from 'hooks'
import { RadioListView } from 'components'

export const UsageReportConsent = ({ close }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const listRef = useRef()
  const [items, setItems] = useState([{ title: 'Yes', isSelected: true }, { title: 'No', isSelected: false }]) // TODO: where to grab current consent state
  const [, setNavigation, getCurrent] = useNavigation('UsageReportConsent', containerRef, listRef, 'y')

  const onKeyCenter = () => {
    const { index } = getCurrent()
    setItems(items.map((item, i) => {
      i === index ? item.isSelected = true : item.isSelected = false
      return item
    }))
    // TODO: trigger consent setting callback to actually update consent state
  }

  useSoftkey('UsageReportConsent', {
    left: i18n('softkey-done'),
    onKeyLeft: close,
    onKeyBackspace: close,
    center: i18n('centerkey-select'),
    onKeyCenter
  }, [])

  useEffect(() => {
    setNavigation(0)
  }, [])

  return (
    <div class='usageconsent' ref={containerRef}>
      <div class='header'>{i18n('usage-consent-header')}</div>
      <div class='body'>
        <div class='message'>
          <p> {i18n('usage-consent-explanation')} </p>
        </div>
        <RadioListView items={items} containerRef={listRef} />
      </div>
    </div>
  )
}
