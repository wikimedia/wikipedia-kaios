import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView } from 'components'
import { useNavigation, useSearch, useI18n, useSoftkey, useOnlineStatus } from 'hooks'
import { articleHistory, goto } from 'utils'
import { getRandomArticleTitle } from 'api'

const SearchOfflinePanel = () => {
  const i18n = useI18n()
  return (
    <div class='search-offline-panel'>
      <div class='search-offline-content'>
        <img src='images/search-offline.svg' />
        <div class='message'>{i18n.i18n('offline-message')}</div>
      </div>
    </div>
  )
}

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const i18n = useI18n()
  const [current, setNavigation, getCurrent] = useNavigation('Search', containerRef, 'y')
  const lang = i18n.locale
  const [query, setQuery, searchResults] = useSearch(lang)
  const isOnline = useOnlineStatus(online => {
    if (online) {
      setQuery(inputRef.current.value)
    }
  })
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

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
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
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <input ref={inputRef} type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={onInput} data-selectable />
      { (isOnline && searchResults) && <ListView header={i18n.i18n('header-search')} items={searchResults} containerRef={containerRef} empty={i18n.i18n('no-result-found')} /> }
      { !isOnline && <SearchOfflinePanel /> }
    </div>
  )
}
