import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle, getArticleMedia, getSuggestedArticles } from 'api'
import { canonicalizeTitle } from 'utils'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState(null)
  const i18n = useI18n()

  const loadArticle = () => {
    setArticle(null)
    Promise.all([getArticle(lang, title), getArticleMedia(lang, title), getSuggestedArticles(lang, title)])
      .then(([article, media, suggestedArticles]) => {
        const { sections, toc } = article
        const footerTitle = i18n.i18n('toc-footer')
        const anchor = canonicalizeTitle(footerTitle)

        // build footer used section and toc
        const sectionsWithFooter = sections.concat({
          title: footerTitle,
          anchor,
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: i18n.i18n('toc-footer'), anchor, sectionIndex: sectionsWithFooter.length - 1 })

        setArticle({ ...article, sections: sectionsWithFooter, toc: tocWithFooter, suggestedArticles, media })
      }, error => {
        setArticle({ error })
      })
  }

  useEffect(() => {
    loadArticle()
  }, [lang, title])

  return [article, loadArticle]
}
