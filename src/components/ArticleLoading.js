import { h } from 'preact'
import { Loading } from 'components'
import { useSoftkey, useI18n, useArticle } from 'hooks'
import { goto } from 'utils'
import { useEffect } from 'preact/hooks'

export const ArticleLoading = ({ close, title, lang }) => {
  const i18n = useI18n()
  const message = i18n('article-loading-message')
  const [article] = useArticle(lang, title)

  /*
  if (article.error) {
    return <Error message={i18n('article-error-message')} onRefresh={loadArticle} />
  }
  */

  useEffect(() => {
    if (article) {
      goto.article(article.contentLang, article.title)
      close()
    }
  }, [article])

  useSoftkey('Loading', {
    left: i18n('softkey-close'),
    onKeyLeft: () => {
      if (close) {
        close()
      } else {
        goto.back()
      }
    },
    onKeyBackspace: () => {
      if (close) {
        close()
      } else {
        goto.back()
      }
    }
  }, [])

  return <Loading message={message} />
}
