import { h } from 'preact'
import { route } from 'preact-router'
import { useRef, useEffect } from 'preact/hooks'
import { ListView } from 'components'
import { useNavigation, useSearch, useI18n, useSoftkey, useOnlineStatus } from 'hooks'
import { articleHistory, goto } from 'utils'

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

  const goToLanguage = () => {
    route('/language')
  }

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
  }

  useSoftkey('Search', {
    right: i18n.i18n('softkey-settings'),
    onKeyRight: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n.i18n('centerkey-select') : '',
    onKeyCenter,
    left: i18n.i18n('settings-language'),
    onKeyLeft: goToLanguage
  }, [current.type])

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  return (
    <div class='search'>
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <div class='home-text-box' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }}>
        <div class='welcome-text'>
          {i18n.i18n('welcome-search-text')}
        </div>
      </div>
      <input ref={inputRef} type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={onInput} data-selectable />
      { (isOnline && searchResults) && <ListView header={i18n.i18n('header-search')} items={searchResults} containerRef={containerRef} empty={i18n.i18n('no-result-found')} /> }
      { !isOnline && <SearchOfflinePanel /> }
    </div>
  )
}
