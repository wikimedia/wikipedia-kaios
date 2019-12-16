import { h } from 'preact'
import { route } from 'preact-router'
import { useArticle, useI18n, useSoftkey } from 'hooks'

export const ArticlePreview = ({ lang, title, close }) => {
  const i18n = useI18n()
  const read = () => {
    close()
    route(`/article/${lang}/${title}`, true)
  }
  useSoftkey('ArticlePreview', {
    left: i18n.i18n('close'),
    onKeyLeft: close,
    center: i18n.i18n('softkey-read'),
    onKeyCenter: read
  }, [])

  const article = useArticle(lang, title)
  const data = article ? article.sections[0] : {
    title: title,
    description: '',
    content: 'Loading...'
  }

  return (
    <div class='article-preview'>
      <div class='shader' />
      <div class='preview-content'>
        <div class='item'>
          <div class='info'>
            <div class='title' dangerouslySetInnerHTML={{ __html: data.title }} />
            <div class='description' dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>
          { data.imageUrl && <div class='img'><img src={data.imageUrl} /></div> }
        </div>
        <div class='preview-text' dangerouslySetInnerHTML={{ __html: data.content }} />
      </div>
    </div>
  )
}
