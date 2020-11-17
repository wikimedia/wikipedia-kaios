import { h } from 'preact'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'

export const ConfirmDialog = ({ title, message, dir, onSubmit, close, closeAll }) => {
  const i18n = useI18n()

  useSoftkey('ConfirmDialog', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close,
    center: i18n('softkey-ok'),
    onKeyCenter: () => { onSubmit(); closeAll() }
  }, [])

  useArticleTextSize('ConfirmDialog')

  return (
    <div class='confirm-dialog adjustable-font-size' dir={dir}>
      { title && <div class='header'>{title}</div> }
      <div class='info'>{message}</div>
    </div>
  )
}
