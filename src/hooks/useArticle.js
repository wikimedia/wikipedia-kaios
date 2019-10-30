import { useState, useEffect } from 'preact/hooks'
import { getArticle } from 'api'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState()

  useEffect(() => {
    getArticle(lang, title)
      .then((article) => setArticle(article))
  }, [lang, title])

  return article
}
