import { h, Fragment } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { getArticle } from './mwapi'
import { Softkey } from './softkey'

const Article = ({ lang, title }) => {
  const [article, setArticle] = useState()

  useEffect(() => {
    getArticle(lang, title)
      .then((article) => setArticle(article))
  }, [lang, title])

  const onKeyLeft = () => { window.location.hash = '' }

  if (!article) {
    return 'Loading...'
  }

  const hasImage = !!article.imageUrl
  return (
    <Fragment>
      <div class='article'>
        { hasImage ? <img src={article.imageUrl} /> : '' }
        <div class={'card' + (hasImage ? ' with-image' : '')}>
          <div class='title' dangerouslySetInnerHTML={{ __html: article.title }} />
          { article.description ? (
            <Fragment>
              <div class='desc'>{article.description}</div>
              <div class='line' />
            </Fragment>
          ) : '' }
          { hasImage ? '' : <div class='preview' dangerouslySetInnerHTML={{ __html: article.preview }} /> }
        </div>
      </div>
      <Softkey
        left='Back'
        onKeyLeft={onKeyLeft}
      />
    </Fragment>
  )
}

export default Article
