import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, OfflinePanel, Consent } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, confirmDialog, isConsentGranted
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
  const [showConsentPopup] = usePopup(Consent)
  const consentGranted = isConsentGranted()
  const isOnline = useOnlineStatus(online => {
    if (online && inputRef.current) {
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

  const goToRandomArticle = () => {
    const [promise] = getRandomArticleTitle(lang)

    promise.then(title => {
      goto.article(lang, title)
    })
  }

  const allowInput = () => {
    if (isOnline === false && consentGranted === false) {
      return false
    }
    return true
  }

  useSoftkey('Search', {
    right: i18n('softkey-settings'),
    onKeyRight: () => { window.location.hash = '/settings' },
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    onKeyLeft: isRandomEnabled() ? goToRandomArticle : null,
    onKeyBackspace: !(query && current.type === 'INPUT') && onExitConfirmDialog
  }, [current.type, query])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    if (!consentGranted && isOnline) {
      showConsentPopup()
    } else {
      setNavigation(0)
    }
  }, [consentGranted, isOnline])

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} />
      { (allowInput()) && <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable maxlength='255' /> }
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { !isOnline && <OfflinePanel /> }
    </div>
  )
}
