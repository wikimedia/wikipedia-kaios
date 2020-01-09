import { h } from 'preact'
import { route } from 'preact-router'
import { useArticle, useI18n, useSoftkey, useArticleTextSize } from 'hooks'

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
    onKeyCenter: read
  }, [])
  useArticleTextSize('ArticlePreview')

  const article = useArticle(lang, title)
  const data = article ? article.sections[0] : {
    title: title,
    preview: 'Loading...'
  }

  return (
    <div class='article-preview'>
      <div class='item'>
        <div class='info'>
          <div class='title adjustable-font-size' dangerouslySetInnerHTML={{ __html: data.title }} />
          <div class='description adjustable-font-size' dangerouslySetInnerHTML={{ __html: data.description }} />
        </div>
        { data.imageUrl && <div class='img'><img src={data.imageUrl} /></div> }
      </div>
      <div class='preview-text adjustable-font-size' dangerouslySetInnerHTML={{ __html: data.preview }} />
    </div>
  )
}
