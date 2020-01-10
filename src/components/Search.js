import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView } from 'components'
import { useNavigation, useSearch, useI18n, useSoftkey } from 'hooks'
import { articleHistory, goto } from 'utils'
import { getRandomArticleTitle } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const [current, setNavigation, getCurrent] = useNavigation('Search', containerRef, 'y')
  const i18n = useI18n()
  const lang = i18n.locale
  const [query, setQuery, searchResults] = useSearch(lang)
  const onKeyCenter = () => {
    const { index, key } = getCurrent()
    if (index) {
      goto.article(lang, key)
    }
  }

  const goToRandomArticle = () => {
    getRandomArticleTitle(lang).then(title => {
      goto.article(lang, title)
    })
  }

  useSoftkey('Search', {
    left: i18n.i18n('softkey-settings'),
    onKeyLeft: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n.i18n('centerkey-select') : '',
    onKeyCenter,
    onKeyRight: goToRandomArticle
  }, [current.type])

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  return (
    <div class='search'>
      <img class='double-u' src='images/w.svg' style={{ display: (searchResults ? 'none' : 'block') }} />
      <input type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={(e) => setQuery(e.target.value)} data-selectable />
      { searchResults && <ListView header={i18n.i18n('header-search')} items={searchResults} containerRef={containerRef} /> }
    </div>
  )
}
