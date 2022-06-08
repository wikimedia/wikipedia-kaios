import { useEffect } from 'preact/hooks'
import { useI18n, useConfirmDialog } from 'hooks'

export const EndCallHandler = () => {
  const i18n = useI18n()
  const showConfirmDialog = useConfirmDialog()

  useEffect(() => {
    const onKeyEndCall = (e) => {
      const key = e.key.toString()

      if (key === 'EndCall') {
        showConfirmDialog({
          title: i18n('confirm-app-close-title'),
          message: i18n('confirm-app-close-message'),
          onDiscardText: i18n('softkey-cancel'),
          onSubmitText: i18n('softkey-exit'),
          onSubmit: window.close
        })
        e.stopPropagation()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', onKeyEndCall)
  }, [])
}
