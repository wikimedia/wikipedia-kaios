import { h } from 'preact'
import { useSoftkey, useI18n } from 'hooks'

export const Error = ({ message, onRefresh }) => {
  const i18n = useI18n()

  useSoftkey('Error', {
    center: i18n.i18n('softkey-refresh'),
    onKeyCenter: onRefresh,
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => history.back()
  })

  return (
    <div class='error'>
      <img src='images/article-error.png' />
      <p class='message'>{message}</p>
    </div>
  )
}
