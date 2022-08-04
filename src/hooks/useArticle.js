import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import {
  getArticle, getArticleSummary, getArticleMediaList,
  getSuggestedArticles, getLanglinks
} from 'api'
import { canonicalizeTitle } from 'utils'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState(null)
  const contentI18n = useI18n(lang)

  let abortFunctions = []

  const abortAll = () => {
    if (abortFunctions) {
      abortFunctions.forEach(f => f())
    }
  }

  const loadArticle = () => {
    setArticle(null)
    const [articlePromise, articleAbort] = getArticle(lang, title)
    const [summaryPromise, summaryAbort] = getArticleSummary(lang, title)
    const [mediaPromise, mediaAbort] = getArticleMediaList(lang, title)
    const [suggestionsPromise, suggestionsAbort] = getSuggestedArticles(lang, title)
    const [languagesPromise, languagesAbort] = getLanglinks(lang, title)
    abortFunctions = [articleAbort, summaryAbort, mediaAbort, suggestionsAbort, languagesAbort]
    Promise.all([articlePromise, summaryPromise, mediaPromise, suggestionsPromise, languagesPromise])
      .then(([article, summary, media, suggestedArticles, languages]) => {
        const { sections, toc } = article
        const footerTitle = contentI18n('toc-footer')
        const anchor = canonicalizeTitle(footerTitle)

        // replace lead image with summary thumbnail
        if (summary.imageUrl) {
          article.sections[0].imageUrl = summary.imageUrl
        }

        // set language count value
        article.languageCount = languages.length

        // build footer used section and toc
        // with header title in the same language as article
        const sectionsWithFooter = sections.concat({
          title: footerTitle,
          anchor,
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: footerTitle, anchor, sectionIndex: sectionsWithFooter.length - 1 })

        setArticle({ ...article, title, sections: sectionsWithFooter, toc: tocWithFooter, suggestedArticles, media })
      }, error => {
        setArticle({ error })
      })
  }

  useEffect(() => {
    loadArticle()
    return abortAll
  }, [lang, title])

  return [article, loadArticle]
}
