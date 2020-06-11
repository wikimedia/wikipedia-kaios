import { h } from 'preact'
import { useArticleSummary, useI18n, useSoftkey, useArticleTextSize } from 'hooks'
import { goto } from 'utils'

export const ArticlePreview = ({ lang, title, dir, close, closeAll }) => {
  const i18n = useI18n()
  const summary = useArticleSummary(lang, title)

  const read = () => {
    const readTitle = summary ? summary.titles.canonical : title
    closeAll()
    goto.article(lang, readTitle, true)
  }
  useSoftkey('ArticlePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: i18n('softkey-read'),
    onKeyCenter: read,
    onKeyBackspace: close
  }, [summary])
  useArticleTextSize('ArticlePreview', [summary])

  return summary ? (
    <div class={`article-preview ${dir}`}>
      <div class='item'>
        <div class='title adjustable-font-size' dangerouslySetInnerHTML={{ __html: summary.titles.display }} />
        { summary.imageUrl && <img class='img' src={summary.imageUrl} /> }
      </div>
      <div class='preview-text adjustable-font-size' dangerouslySetInnerHTML={{ __html: summary.preview }} />
    </div>
  ) : <LoadingPreview title={title} dir={dir} />
}

const LoadingPreview = ({ title, dir }) => (
  <div class={`article-preview loading ${dir}`}>
    <div class='item'>
      <div class='title adjustable-font-size'>{title}</div>
      <div class='loading-block img' />
    </div>
    <div class='preview-text' >
      <div class='loading-block full' />
      <div class='loading-block full' />
      <div class='loading-block full' />
    </div>
  </div>
)
