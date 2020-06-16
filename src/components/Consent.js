import { h } from 'preact'
import { useI18n, useSoftkey, useOnlineStatus } from 'hooks'
import { grantConsent, goto } from 'utils'
import { OfflinePanel } from 'components'

export const Consent = () => {
  const i18n = useI18n()
  const isOnline = useOnlineStatus()

  const onAgree = () => {
    if (isOnline) {
      grantConsent()
      goto.search()
    }
  }

  useSoftkey('ConsentMessage', {
    center: isOnline ? i18n('softkey-consent-agree') : '',
    onKeyCenter: onAgree,
    left: isOnline ? i18n('softkey-consent-terms') : '',
    onKeyLeft: () => isOnline && goto.termsOfUse,
    right: isOnline ? i18n('softkey-consent-policy') : '',
    onKeyRight: () => isOnline && goto.privacyPolicy,
    backspace: () => { window.exit() }
  }, [isOnline])

  return (
    <div class='consent'>
      <div class='header'>{i18n('app-title')}</div>
      <div class='body'>
        {
          isOnline ? <div>
            <div class='message'>{i18n('consent-policy-message')}</div>
            <div class='message'>{i18n('consent-terms-message')}</div>
          </div> : <OfflinePanel />
        }

      </div>
    </div>
  )
}
