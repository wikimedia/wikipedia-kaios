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
      center: i18n('consent-softkeys-agree'),
      onKeyCenter: onAgree,
      left: i18n('consent-softkeys-terms'),
      onKeyLeft: goto.termsOfUse,
      right: i18n('consent-softkeys-policy'),
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
          isOnline ? <div class='messages' dir='auto'>
            <div class='message'>{i18n('consent-message-policy')}</div>
            <div class='message'>{i18n('consent-message-and')}</div>
            <div class='message'>{i18n('consent-message-terms')}</div>
          </div> : <OfflinePanel />
        }
      </div>
    </div>
  )
}
