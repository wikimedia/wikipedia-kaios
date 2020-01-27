import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle, getSuggestedArticles } from 'api'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState({ loading: true })
  const i18n = useI18n()

  const loadArticle = () => {
    Promise.all([getArticle(lang, title), getSuggestedArticles(lang, title)])
      .then(([article, suggestedArticles]) => {
        const { sections, toc } = article

        // build footer used section and toc
        const sectionsWithFooter = sections.concat({
          title: i18n.i18n('toc-footer'),
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: i18n.i18n('toc-footer'), sectionIndex: sectionsWithFooter.length - 1 })

        setArticle({ ...article, sections: sectionsWithFooter, toc: tocWithFooter, suggestedArticles })
      }, error => {
        setArticle({ error })
      })
  }

  useEffect(() => {
    loadArticle()
  }, [lang, title])

  return [article, loadArticle]
}
