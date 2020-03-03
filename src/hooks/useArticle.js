import { useState, useEffect } from 'preact/hooks'
import { getArticle, getArticleMedia, getSuggestedArticles, loadMessages } from 'api'
import { canonicalizeTitle } from 'utils'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState(null)

  const loadArticle = () => {
    setArticle(null)
    Promise.all([getArticle(lang, title), getArticleMedia(lang, title), getSuggestedArticles(lang, title), loadMessages(lang)])
      .then(([article, media, suggestedArticles, messages]) => {
        const { sections, toc } = article
        const footerTitle = messages[lang] && messages[lang]['suggested-articles'] ? messages[lang]['suggested-articles'] : messages.en['suggested-articles']
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
