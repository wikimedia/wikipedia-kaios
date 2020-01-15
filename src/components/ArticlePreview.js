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

  return summary ? (
    <div class='article-preview'>
      <div class='item'>
        <div class='title adjustable-font-size' dangerouslySetInnerHTML={{ __html: summary.title }} />
        { summary.imageUrl && <img class='img' src={summary.imageUrl} /> }
      </div>
      <div class='preview-text adjustable-font-size' dangerouslySetInnerHTML={{ __html: summary.preview }} />
    </div>
  ) : <LoadingPreview title={title} />
}

const LoadingPreview = ({ title }) => (
  <div class='article-preview loading'>
    <div class='item'>
      <div class='title'>{title}</div>
      <div class='loading-block img' />
    </div>
    <div class='preview-text' >
      <div class='loading-block full' />
      <div class='loading-block full' />
      <div class='loading-block full' />
    </div>
  </div>
)
