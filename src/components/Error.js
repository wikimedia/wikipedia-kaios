import { h } from 'preact'
import { useSoftkey, useI18n } from 'hooks'
import { goto } from 'utils'

export const Error = ({ message, onRefresh }) => {
  const i18n = useI18n()

  useSoftkey('Error', {
    center: i18n('softkey-refresh'),
    onKeyCenter: onRefresh,
    left: i18n('softkey-close'),
    onKeyLeft: () => goto.back()
  })

  return (
    <div class='error'>
      <img src='images/article-error.png' />
      <p class='message'>{message}</p>
    </div>
  )
}
