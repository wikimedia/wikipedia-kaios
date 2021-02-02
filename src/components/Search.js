import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, OfflinePanel } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, confirmDialog
} from 'utils'

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
    } else if (isRandomEnabled() && !query) {
      goto.randomArticle()
    }
  }

  const onInput = ({ target }) => {
    if (isOnline) {
      setQuery(target.value)
    }
  }

  const onExitConfirmDialog = () => {
    const isInputType = current.type === 'INPUT'
    if (isInputType) {
      setNavigation(-1)
    }
    confirmDialog({
      title: i18n('confirm-app-close-title'),
      message: i18n('confirm-app-close-message'),
      onDiscardText: i18n('softkey-cancel'),
      onDiscard: () => {
        if (isInputType) {
          setNavigation(0)
        }
      },
      onSubmitText: i18n('softkey-exit'),
      onSubmit: window.close
    })
  }

  useSoftkey('Search', {
    right: i18n('softkey-settings'),
    onKeyRight: goto.settings,
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    left: i18n('softkey-tips'),
    onKeyLeft: goto.tips,
    onKeyBackspace: !(query && current.type === 'INPUT') && onExitConfirmDialog
  }, [current.type, query])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable maxlength='255' />
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { !isOnline && <OfflinePanel /> }
    </div>
  )
}
