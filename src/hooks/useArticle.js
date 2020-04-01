import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle, getArticleMediaList, getSuggestedArticles } from 'api'
import { canonicalizeTitle } from 'utils'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState(null)
  const contentI18n = useI18n(lang)
  const moreInformationText = contentI18n('more-information')
  const translation = { moreInformationText }

  const loadArticle = () => {
    setArticle(null)
    Promise.all([getArticle(lang, title, translation), getArticleMediaList(lang, title), getSuggestedArticles(lang, title)])
      .then(([article, media, suggestedArticles]) => {
        const { sections, toc } = article
        const footerTitle = contentI18n('toc-footer')
        const anchor = canonicalizeTitle(footerTitle)

        // build footer used section and toc
        // with header title in the same language as article
        const sectionsWithFooter = sections.concat({
          title: footerTitle,
          anchor,
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: footerTitle, anchor, sectionIndex: sectionsWithFooter.length - 1 })

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
