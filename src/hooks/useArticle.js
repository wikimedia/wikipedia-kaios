import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { useI18n } from 'hooks'
import { getArticle, getArticleFooter } from 'api'
import { ArticleFooter } from 'components'

export const useArticle = (lang, title) => {
  const [article, setArticle] = useState()
  const i18n = useI18n()

  useEffect(() => {
    Promise.all([getArticle(lang, title), getArticleFooter(lang, title)])
      .then(([article, suggestedItems]) => {
        const { sections, toc } = article

        // build footer used section and toc
        const sectionsWithFooter = sections.concat({
          title: i18n.i18n('toc-footer'),
          content: <ArticleFooter lang={lang} title={title} items={suggestedItems} />,
          imageUrl: false,
          isFooter: true
        })
        const tocWithFooter = toc.concat({ level: 1, line: i18n.i18n('toc-footer'), sectionIndex: sectionsWithFooter.length - 1 })

        setArticle({ ...article, sections: sectionsWithFooter, toc: tocWithFooter })
      })
  }, [lang, title])

  return article
}
