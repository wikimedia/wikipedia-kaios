import { h } from 'preact'
import {
  useArticleSummary, useI18n, useSoftkey,
  useArticleTextSize, useArticlePreviewTracking
} from 'hooks'
import { goto } from 'utils'

export const ArticlePreview = ({ lang, title, source, dir, close, closeAll }) => {
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
  const [textSize] = useArticleTextSize('ArticlePreview')

  useArticlePreviewTracking(summary, source, lang)

  return summary ? (
    <div class='article-preview' dir={dir}>
      <div class='item'>
        <div class={`title font-size-${textSize}`} dangerouslySetInnerHTML={{ __html: summary.titles.display }} />
        { summary.imageUrl && <img class='img' src={summary.imageUrl} /> }
      </div>
      <div class={`preview-text font-size-${textSize}`} dangerouslySetInnerHTML={{ __html: summary.preview }} />
    </div>
  ) : <LoadingPreview title={title} dir={dir} textSize={textSize} />
}

const LoadingPreview = ({ title, dir, textSize }) => (
  <div class='article-preview loading' dir={dir}>
    <div class='item'>
      <div class={`title font-size-${textSize}`}>{title}</div>
      <div class='loading-block img' />
    </div>
    <div class='preview-text' >
      <div class='loading-block full' />
      <div class='loading-block full' />
      <div class='loading-block full' />
    </div>
  </div>
)
