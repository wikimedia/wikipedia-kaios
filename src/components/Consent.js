import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useScroll } from 'hooks'
import { grantConsent, goto } from 'utils'

export const Consent = ({ close }) => {
  const i18n = useI18n()
  const bodyRef = useRef()
  const [scrollDown, scrollUp] = useScroll(bodyRef, 10, 'y')

  const onAgree = () => {
    grantConsent()
    close()
  }

  useSoftkey('ConsentMessage', {
    center: i18n('consent-softkeys-agree'),
    onKeyCenter: onAgree,
    left: i18n('consent-softkeys-terms'),
    onKeyLeft: goto.termsOfUse,
    right: i18n('consent-softkeys-policy'),
    onKeyRight: goto.privacyPolicy,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyBackspace: () => { window.close() }
  })

  return (
    <div class='consent'>
      <div class='header'>{i18n('consent-privacy-terms')}</div>
      <div class='body' ref={bodyRef}>
        <div class='messages' dir='auto'>
          <div class='message'>{i18n('consent-message-policy')}</div>
          <div class='message'>{i18n('consent-message-and')}</div>
          <div class='message'>{i18n('consent-message-terms')}</div>
        </div>
      </div>
    </div>
  )
}
