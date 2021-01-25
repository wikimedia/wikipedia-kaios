import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useOnlineStatus, useScroll } from 'hooks'
import { grantConsent, goto } from 'utils'
import { OfflinePanel } from 'components'

export const Consent = ({ close }) => {
  const i18n = useI18n()
  const isOnline = useOnlineStatus()
  const containerRef = useRef()
  const [scrollDown, scrollUp] = useScroll(containerRef, 10, 'y')

  const onAgree = () => {
    grantConsent()
    close()
  }

  const softkeyConfig = {
    offline: {
      onKeyBackspace: () => { window.close() }
    },
    online: {
      center: i18n('consent-softkeys-agree'),
      onKeyCenter: onAgree,
      left: i18n('consent-softkeys-terms'),
      onKeyLeft: goto.termsOfUse,
      right: i18n('consent-softkeys-policy'),
      onKeyRight: goto.privacyPolicy,
      onKeyArrowDown: scrollDown,
      onKeyArrowUp: scrollUp,
      onKeyBackspace: () => { window.close() }
    }
  }
  useSoftkey('ConsentMessage', softkeyConfig[isOnline ? 'online' : 'offline'], [isOnline], true)

  return (
    <div class='consent' ref={containerRef}>
      <div class='header'>{i18n('consent-privacy-terms')}</div>
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
