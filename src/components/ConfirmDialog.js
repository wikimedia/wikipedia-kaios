import { h } from 'preact'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'

export const ConfirmDialog = ({
  title, message, dir,
  onSubmitText, onSubmit, onDiscardText, onDiscard,
  close, closeAll
}) => {
  const i18n = useI18n()

  const onDiscardFn = () => {
    onDiscard()
    close()
  }

  useSoftkey('ConfirmDialog', {
    left: onDiscardText || i18n('softkey-close'),
    onKeyLeft: onDiscardFn,
    onKeyBackspace: onDiscardFn,
    right: onSubmitText || i18n('softkey-ok'),
    onKeyRight: () => { onSubmit(); closeAll() }
  }, [])

  const [fontSizeClass] = useArticleTextSize()

  return (
    <div class={`confirm-dialog ${fontSizeClass}`} dir={dir}>
      { title && <div class='header'>{title}</div> }
      <div class='info'>{message}</div>
    </div>
  )
}
