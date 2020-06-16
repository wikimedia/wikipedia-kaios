import { h } from 'preact'
import { useI18n, useSoftkey, useOnlineStatus } from 'hooks'
import { grantConsent, goto } from 'utils'
import { OfflinePanel } from 'components'

export const Consent = () => {
  const i18n = useI18n()
  const isOnline = useOnlineStatus()

  const onAgree = () => {
    grantConsent()
    goto.search()
  }

  const softkeyConfig = {
    offline: {
      backspace: () => { window.exit() }
    },
    online: {
      center: i18n('softkey-consent-agree'),
      onKeyCenter: onAgree,
      left: i18n('softkey-consent-terms'),
      onKeyLeft: goto.termsOfUse,
      right: i18n('softkey-consent-policy'),
      onKeyRight: goto.privacyPolicy,
      backspace: () => { window.exit() }
    }
  }
  useSoftkey('ConsentMessage', softkeyConfig[isOnline ? 'online' : 'offline'], [isOnline], true)

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
