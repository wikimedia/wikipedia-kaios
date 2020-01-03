import { h } from 'preact'
import { useI18n, useSoftkey } from 'hooks'

export const ConfirmDialog = ({ message, onSubmit, close }) => {
  const i18n = useI18n()

  useSoftkey('ConfirmDialog', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-ok'),
    onKeyCenter: () => { onSubmit(); close() }
  }, [])

  return (
    <div class='confirm-dialog'>
      <div class='info'>
        <div class='title'>{message}</div>
      </div>
    </div>
  )
}
