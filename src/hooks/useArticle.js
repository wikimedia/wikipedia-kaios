import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle, getArticleMedia, getSuggestedArticles } from 'api'
import { canonicalizeTitle } from 'utils'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState(null)
  const i18n = useI18n()

  // compile translation in content language
  const moreInformationText = i18n.getTranslation(lang, 'more-information')
  const translation = { moreInformationText }

  const loadArticle = () => {
    setArticle(null)
    Promise.all([getArticle(lang, title, translation), getArticleMedia(lang, title), getSuggestedArticles(lang, title)])
      .then(([article, media, suggestedArticles]) => {
        const { sections, toc } = article
        const i18nLocale = i18n.locale

        i18n.setLocale(article.contentLang)
        const footerTitle = i18n.i18n('toc-footer')
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

        i18n.setLocale(i18nLocale)

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
