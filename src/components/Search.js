import { h } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { ListView, OfflinePanel, Consent, SearchLoading, Feed } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup, useHistoryState,
  useExperimentConfig
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, confirmDialog, isConsentGranted,
  skipIntroAnchor
} from 'utils'
import { getRandomArticleTitle } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [isFeedExpanded, setIsFeedExpanded] = useState(false)
  const [lastFeedIndex, setLastFeedIndex] = useHistoryState('lastFeedIndex', null)
  const [current, setNavigation, getCurrent, getAllElements, navigateNext, navigatePrevious] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
  const isExperimentGroup = useExperimentConfig(lang)
  const [query, setQuery, searchResults, loading] = useSearch(lang)
  const [showConsentPopup, closeConsentPopup] = usePopup(Consent)
  const consentGranted = isConsentGranted()
  const isOnline = useOnlineStatus(online => {
    if (online && inputRef.current) {
      setQuery(inputRef.current.value)
    }
  })
  const onKeyCenter = () => {
    if (allowUsage()) {
      const { index, key } = getCurrent()
      if (index && isFeedExpanded) {
        setLastFeedIndex(index)
      }
      if (index) {
        goto.article(lang, key)
      } else if (isRandomEnabled() && !query) {
        goToRandomArticle()
      }
    }
  }

  const onKeyBackSpace = () => {
    if (isFeedExpanded) {
      setIsFeedExpanded(false)
      setLastFeedIndex(null)
      listRef.current.scrollTop = 0
      setNavigation(0)
    } else {
      onExitConfirmDialog()
    }
  }

  const onKeyArrowDown = () => {
    const index = getCurrent().index
    if (!isFeedExpanded && !searchResults && index === 0) {
      setIsFeedExpanded(true)
      navigateNext()
    } else if (isFeedExpanded && index + 1 > getAllElements().length - 1) {
      setNavigation(1)
    } else {
      navigateNext()
    }
  }

  const onKeyArrowUp = () => {
    const index = getCurrent().index
    if (isFeedExpanded && !searchResults && index === 1) {
      setIsFeedExpanded(false)
      setLastFeedIndex(null)
      navigatePrevious()
    } else if (!isFeedExpanded && !searchResults && index === 0) {
      setNavigation(0)
    } else {
      navigatePrevious()
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

  const allowUsage = () => {
    return isOnline || consentGranted
  }

  useSoftkey('Search', {
    right: allowUsage() ? i18n('softkey-settings') : '',
    onKeyRight: allowUsage() ? goto.settings : null,
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    left: allowUsage() ? i18n('softkey-tips') : '',
    onKeyLeft: allowUsage() ? goto.tips : null,
    onKeyBackspace: !(query && current.type === 'INPUT') && onKeyBackSpace,
    onKeyArrowDown: !loading && onKeyArrowDown,
    onKeyArrowUp: !loading && onKeyArrowUp
  }, [current.type, query, isOnline, searchResults, loading])

  useTracking('Search', lang)

  useEffect(() => {
    articleHistory.clear()
    if (!consentGranted && isOnline) {
      showConsentPopup()
    } else {
      closeConsentPopup()
      setNavigation(0)
    }
  }, [consentGranted, isOnline])

  const hideW = searchResults || !isOnline || loading || (isFeedExpanded && isExperimentGroup)
  const showSearchBar = allowUsage()
  const showResultsList = isOnline && searchResults && !loading
  const showLoading = isOnline && loading
  const showOfflinePanel = !isOnline
  const showFeed = isOnline && !searchResults && !showLoading && !showOfflinePanel && isExperimentGroup

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: (hideW ? 'none' : 'block') }} />
      { showSearchBar && <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable maxlength='255' /> }
      { showResultsList && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { showLoading && <SearchLoading /> }
      { showOfflinePanel && <OfflinePanel /> }
      { showFeed && <Feed lang={lang} isExpanded={isFeedExpanded} setIsExpanded={setIsFeedExpanded} lastIndex={lastFeedIndex} setNavigation={setNavigation} containerRef={listRef} /> }
    </div>
  )
}

export const goToRandomArticle = (closePopup, skipIntro = false) => {
  const lang = getAppLanguage()
  const [promise] = getRandomArticleTitle(lang)

  promise.then(title => {
    if (closePopup) {
      closePopup()
    }
    goto.article(lang, skipIntro ? [title, skipIntroAnchor] : title)
  })
}
