import { h } from 'preact'
import { Loading } from 'components'
import { useSoftkey, useI18n } from 'hooks'
import { goto } from 'utils'

export const ArticleLoading = ({ onClose }) => {
  const i18n = useI18n()
  const message = i18n('article-loading-message')

  useSoftkey('Loading', {
    left: i18n('softkey-close'),
    onKeyLeft: () => {
      if (onClose) {
        onClose()
      } else {
        goto.back()
      }
    },
    onKeyBackspace: () => {
      if (onClose) {
        onClose()
      } else {
        goto.back()
      }
    }
  }, [])

  return <Loading message={message} />
}
