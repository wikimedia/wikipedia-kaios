import { h } from 'preact'
import { useSoftkey, useI18n } from 'hooks'
export const Loading = ({ close, message }) => {
  const i18n = useI18n()

  const onClose = () => {
    if (close) {
      close()
    } else {
      history.back()
    }
  }

  useSoftkey('Loading', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: onClose
  })

  return <div class='loading-planet'>
    <img class='moon' src='images/loading-moon.svg' />
    <img class='earth' src='images/loading-earth.svg' />
    <img class='galaxy' src='images/loading-galaxy.svg' />
    <p class='message'>{message}</p>
  </div>
}
