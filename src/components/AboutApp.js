import { h } from 'preact'
import { useI18n, useSoftkey } from 'hooks'

export const AboutApp = () => {
  const i18n = useI18n()
  const APP_VERSION = JSON.stringify(require('../../package.json').version).slice(1, -1)

  useSoftkey('AboutApp', {
    right: i18n.i18n('softkey-read-more'),
    onKeyRight: () => window.open('https://wikimediafoundation.org/'),
    left: i18n.i18n('softkey-close'),
    onKeyLeft: () => history.back()
  }, [])

  return (
    <div class='aboutapp'>
      <div class='header'>{i18n.i18n('gallery-about-header')}</div>
      <div class='body'>
        <div class='image'>
          <img src='/images/onboarding-0.png' />
        </div>
        <div class='image'>
          <img src='/images/wikipedia-wordmark-en.png' />
        </div>
        <div class='version'>
          <p>{APP_VERSION}</p>
        </div>
        <div class='message'>
          <p>{i18n.i18n('about-app-message')}</p>
        </div>
      </div>
    </div>
  )
}
