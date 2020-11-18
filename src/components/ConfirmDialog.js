import { h } from 'preact'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'

export const ConfirmDialog = ({ title, message, dir, onSubmit, onDiscard, close, closeAll }) => {
  const i18n = useI18n()

  const onDiscardFn = () => {
    onDiscard()
    close()
  }

  useSoftkey('ConfirmDialog', {
    left: i18n('softkey-close'),
    onKeyLeft: onDiscardFn,
    onKeyBackspace: onDiscardFn,
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
