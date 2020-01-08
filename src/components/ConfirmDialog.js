import { h } from 'preact'
import { useLayoutEffect } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'

export const ConfirmDialog = ({ message, onSubmit, close }) => {
  const i18n = useI18n()

  useSoftkey('ConfirmDialog', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-ok'),
    onKeyCenter: () => { onSubmit(); close() },
    ...articleTextSize.getSoftkeyEffect()
  }, [])

  useLayoutEffect(() => {
    articleTextSize.init('.confirm-dialog')
  }, [])

  return (
    <div class='confirm-dialog'>
      <div class='info'>
        <div class='title'>{message}</div>
      </div>
    </div>
  )
}
