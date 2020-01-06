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
    <img class='moon' src='images/group-4.svg' />
    <img class='earth' src='images/group-5.svg' />
    <img class='galaxy' src='images/group-6.svg' />
    <p class='message'>{message}</p>
  </div>
}
