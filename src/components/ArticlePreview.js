import { h } from 'preact'
import { memo } from 'preact/compat'
import {
  useArticleSummary, useI18n, useSoftkey,
  useArticlePreviewTracking
} from 'hooks'
import { goto } from 'utils'

const ArticlePreviewLoading = memo(({ title, dir }) => (
  <div class='article-preview loading' dir={dir}>
    <div class='item'>
      <div class='preview-title'>{title}</div>
      <div class='loading-block img' />
    </div>
    <div class='preview-text' >
      <div class='loading-block full' />
      <div class='loading-block full' />
      <div class='loading-block full' />
    </div>
  </div>
))

const ArticlePreviewContent = memo(({ dir, titleHtml, imageUrl, previewHtml }) => (
  <div class='article-preview' dir={dir}>
    <div class='item'>
      <div class='preview-title' dangerouslySetInnerHTML={{ __html: titleHtml }} />
      { imageUrl && <img class='img' src={imageUrl} /> }
    </div>
    <div class='preview-text' dangerouslySetInnerHTML={{ __html: previewHtml }} />
  </div>
))

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

  useArticlePreviewTracking(summary, source, lang)

  return summary
    ? <ArticlePreviewContent
      dir={dir}
      titleHtml={summary.titles.display}
      imageUrl={summary.imageUrl}
      previewHtml={summary.preview}
    />
    : <ArticlePreviewLoading title={title} dir={dir} />
}
