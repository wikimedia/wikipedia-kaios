import { h } from 'preact'
import { useArticleSummary, useI18n, useSoftkey, useArticleTextSize } from 'hooks'
import { goto } from 'utils'

export const ArticlePreview = ({ lang, title, close }) => {
  const i18n = useI18n()
  const read = () => {
    close()
    goto.article(lang, title, true)
  }
  useSoftkey('ArticlePreview', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-read'),
    onKeyCenter: read
  }, [])
  useArticleTextSize('ArticlePreview')

  const summary = useArticleSummary(lang, title)
  const data = summary || {
    title: title,
    preview: 'Loading...'
  }

  return (
    <div class='article-preview'>
      <div class='item'>
        <div class='title adjustable-font-size' dangerouslySetInnerHTML={{ __html: data.title }} />
        { data.imageUrl && <img src={data.imageUrl} /> }
      </div>
      <div class='preview-text adjustable-font-size' dangerouslySetInnerHTML={{ __html: data.preview }} />
    </div>
  )
}
