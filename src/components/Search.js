import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, ConsentPopup, OfflinePanel } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup
} from 'hooks'
import { articleHistory, goto, getAppLanguage, hasConsentBeenAnswered } from 'utils'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [current, setNavigation, getCurrent] = useNavigation('Search', containerRef, listRef, 'y')
  const [showConsentPopup] = usePopup(ConsentPopup)
  const lang = getAppLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
  const hasUserConsentBeenAnswered = hasConsentBeenAnswered()
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

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
  }

  useSoftkey('Search', {
    right: i18n('softkey-settings'),
    onKeyRight: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter
  }, [current.type])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    if (!hasUserConsentBeenAnswered) {
      showConsentPopup()
    } else {
      setNavigation(0)
    }
  }, [hasUserConsentBeenAnswered])

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable />
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { !isOnline && <OfflinePanel /> }
    </div>
  )
}
