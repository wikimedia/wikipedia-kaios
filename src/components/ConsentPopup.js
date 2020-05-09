import { h } from 'preact'
import { useI18n, useSoftkey } from 'hooks'
import { setConsentStatus } from 'utils'

export const ConsentPopup = ({ close }) => {
  const i18n = useI18n()

  const handleConsent = response => {
    return () => {
      setConsentStatus(response)
      close()
    }
  }

  useSoftkey('ConsentMessage', {
    center: i18n('softkey-yes'),
    onKeyCenter: handleConsent(true),
    left: i18n('softkey-no'),
    onKeyLeft: handleConsent(false)
  }, [])

  return (
    <div class='usageconsentprompt'>
      <div class='header'>{i18n('usage-consent-prompt-header')}</div>
      <p class='preview-text'>{i18n('usage-consent-prompt')}</p>
    </div>
  )
}
