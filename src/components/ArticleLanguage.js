import { h } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, useSearchArticleLanguage } from 'hooks'
import { ListView, Loading } from 'components'
import { goto } from 'utils'

export const ArticleLanguage = ({ lang, title, close, closeAll }) => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [articleLang, setArticleLang] = useState(lang)
  const [items, query, setQuery, numOfLanglink] = useSearchArticleLanguage(articleLang, title)

  if (!items.length && !query) {
    return <Loading message={i18n('article-language-loading-message')} onClose={close} />
  }

  const [, setNavigation, getCurrent] = useNavigation('ArticleLanguage', containerRef, listRef, 'y')
  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const itemIndex = index - 1
      const item = items[itemIndex]
      const { lang, description } = item
      setArticleLang(lang)
      goto.article(lang, description, true)
      closeAll()
    }
  }

  const onKeyLeft = () => {
    const item = items.find(item => item.isSelected)
    if (item) {
      const { lang, description } = item
      goto.article(lang, description, true)
    }
    closeAll()
  }

  const onKeyBackspace = () => {
    if (query && getCurrent().type === 'INPUT') {
      setQuery(query.slice(0, -1))
    } else {
      close()
    }
  }

  useSoftkey('ArticleLanguage', {
    left: i18n('softkey-done'),
    onKeyLeft,
    right: i18n('softkey-search'),
    onKeyRight: () => setNavigation(0),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace
  }, [items])

  useEffect(() => {
    setNavigation(0)
  }, [])

  return <div class='articlelanguage' ref={containerRef}>
    <input type='text' placeholder={i18n('search-language-placeholder')} value={query} onInput={e => setQuery(e.target.value)} data-selectable />
    <ListView header={i18n('article-language-available', numOfLanglink)} items={items} containerRef={listRef} empty={i18n('no-result-found')} />
  </div>
}
