import { h, Fragment } from 'preact'
import { useState } from 'preact/hooks'
import { ArticleHeader } from 'components/articleheader.jsx'
import { ArticleBody } from 'components/articlebody.jsx'
import { Softkey } from 'components/softkey'
import { useArticle } from 'hooks/useArticle'
import { useBackToSearch } from 'hooks/useBackToSearch'
import { useKeys } from 'hooks/useKeys'

export const Article = ({ lang, title }) => {
  const article = useArticle(lang, title)
  const [showBody, setShowBody] = useState(false)

  useBackToSearch()

  useKeys({
    ArrowDown: () => {
      setShowBody(true)
    }
  })

  if (!article) {
    return 'Loading...'
  }

  return (
    <Fragment>
      { (showBody) ? (
        <ArticleBody content={article.content} />
      ) : (
        <ArticleHeader
          imageUrl={article.imageUrl}
          title={article.title}
          description={article.description}
          preview={article.preview}
        />
      ) }
      <Softkey
        left='Settings'
      />
    </Fragment>
  )
}

// export default Article
