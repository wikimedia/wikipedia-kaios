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
        const i18nLocale = i18n.locale

        i18n.setLocale(article.contentLang)
        const footerTitle = i18n.i18n('toc-footer')
        const anchor = canonicalizeTitle(footerTitle)

        // parse wikitable caption
        sections.forEach(section => {
          section.content = fixTableCaption(section.content, i18n)
        })

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

const fixTableCaption = (htmlString, i18n) => {
  const moreInformationText = i18n.i18n('more-information')
  const hiddenClassName = 'hidden-in-table'
  const parser = new DOMParser()
  const node = parser.parseFromString(htmlString, 'text/html')
  const tableNodes = node.querySelectorAll('table.wikitable')
  for (const tableNode of tableNodes) {
    const thContent = Array.from(tableNode.querySelectorAll('th')).map(th => th.textContent).join(', ')
    const normalizedThContent = thContent.replace(/\[\d+]/g, '')
    if (tableNode.caption && tableNode.caption.textContent) {
      tableNode.caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p><span>${tableNode.caption.textContent}</span>`
    } else {
      const caption = tableNode.createCaption()
      caption.className = hiddenClassName
      caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p>Table`
    }
  }

  return node.childNodes[0].innerHTML
}
