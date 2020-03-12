import { h } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, useSearchArticleLanguage } from 'hooks'
import { RadioListView, Loading } from 'components'
import { goto } from 'utils'

export const ArticleLanguage = ({ lang, title, close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [articleLang, setArticleLang] = useState(lang)
  const [items, query, setQuery, numOfLanglink] = useSearchArticleLanguage(articleLang, title)

  if (!items.length && !query) {
    return <Loading message={i18n.i18n('article-language-loading-message')} onClose={close} />
  }

  const [, setNavigation, getCurrent] = useNavigation('ArticleLanguage', containerRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]
      setArticleLang(item.lang)
    }
  }

  const onKeyLeft = () => {
    const item = items.find(item => item.isSelected)
    if (item) {
      const { lang, description } = item
      goto.article(lang, description, true)
    }
    close()
  }

  useSoftkey('ArticleLanguage', {
    left: i18n.i18n('softkey-done'),
    onKeyLeft,
    right: i18n.i18n('softkey-search'),
    onKeyRight: () => setNavigation(0),
    center: i18n.i18n('centerkey-select'),
    onKeyCenter
  }, [items])

  useEffect(() => {
    setNavigation(0)
  }, [])

  return <div class='articlelanguage'>
    <input type='text' placeholder={i18n.i18n('search-language-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
    <RadioListView header={i18n.i18n('article-language-available', numOfLanglink)} items={items} containerRef={containerRef} empty={i18n.i18n('no-result-found')} />
  </div>
}
