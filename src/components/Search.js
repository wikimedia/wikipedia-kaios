import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, OfflinePanel } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled
} from 'utils'
import { getRandomArticleTitle } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [current, setNavigation, getCurrent] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
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

  const onKeyBackspace = () => {
    if (query && getCurrent().type === 'INPUT') {
      setQuery(query.slice(0, -1))
    } else {
      window.close()
    }
  }

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
  }

  const goToRandomArticle = () => {
    const [promise] = getRandomArticleTitle(lang)

    promise.then(title => {
      goto.article(lang, title)
    })
  }

  useSoftkey('Search', {
    right: i18n('softkey-settings'),
    onKeyRight: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    onKeyLeft: isRandomEnabled() ? goToRandomArticle : null,
    onKeyBackspace
  }, [current.type, query])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable />
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { !isOnline && <OfflinePanel /> }
    </div>
  )
}
