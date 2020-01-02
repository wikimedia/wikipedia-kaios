import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle } from 'api'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState()
  const i18n = useI18n()

  useEffect(() => {
    getArticle(lang, title, i18n)
      .then((article) => setArticle(article))
  }, [lang, title])

  return article
}
