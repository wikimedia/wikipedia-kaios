import { h } from 'preact'
import { useLayoutEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { useArticle, useI18n, useSoftkey } from 'hooks'
import { ArticleTextSize } from 'utils'

export const ArticlePreview = ({ lang, title, close }) => {
  const i18n = useI18n()
  const read = () => {
    close()
    route(`/article/${lang}/${title}`, true)
  }
  useSoftkey('ArticlePreview', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-read'),
    onKeyCenter: read,
    ...ArticleTextSize.getSoftkeyEffect()
  }, [])

  const article = useArticle(lang, title)
  const data = article ? article.sections[0] : {
    title: title,
    preview: 'Loading...'
  }

  useLayoutEffect(() => {
    ArticleTextSize.init('.preview-text')
  }, [])

  return (
    <div class='article-preview'>
      <div class='item'>
        <div class='info'>
          <div class='title' dangerouslySetInnerHTML={{ __html: data.title }} />
          <div class='description' dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
        { data.imageUrl && <div class='img'><img src={data.imageUrl} /></div> }
      </div>
      <div class='preview-text' dangerouslySetInnerHTML={{ __html: data.preview }} />
    </div>
  )
}
