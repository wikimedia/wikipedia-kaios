import { h } from 'preact'
import { useI18n, useSoftkey } from 'hooks'
import { grantConsent, goto } from 'utils'

export const Consent = () => {
  const i18n = useI18n()

  const onAgree = () => {
    grantConsent()
    goto.search()
  }

  useSoftkey('ConsentMessage', {
    center: i18n('softkey-consent-agree'),
    onKeyCenter: onAgree,
    left: i18n('softkey-consent-terms'),
    onKeyLeft: goto.termsOfUse,
    right: i18n('softkey-consent-policy'),
    onKeyRight: goto.privacyPolicy,
    backspace: () => { window.exit() }
  }, [])

  return (
    <div class='usageconsent'>
      <div class='header'>{i18n('app-title')}</div>
      <div class='body'>
        <img src='/images/w-icon.svg' />
        <div class='title'>{i18n('consent-title')}</div>
        <div class='subtitle'>{i18n('consent-subtitle')}</div>
        <div class='message'>{i18n('consent-message')}</div>
      </div>
    </div>
  )
}
