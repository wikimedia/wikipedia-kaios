import { h } from 'preact'
import { useRef, useEffect, useState } from 'preact/hooks'
import { ListView, OfflinePanel, Consent, Feed } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, confirmDialog, isConsentGranted,
  isTrendingArticlesGroup, isCuratedTopicsGroup
} from 'utils'
import { getRandomArticleTitle } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [isFeedExpanded, setIsFeedExpanded] = useState(false)
  const [current, setNavigation, getCurrent, getAllElements, navigateNext, navigatePrevious] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
  const [query, setQuery, searchResults] = useSearch(lang)
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
      if (index) {
        goto.article(lang, key)
      }
    }
  }

  const onKeyBackSpace = () => {
    if (isFeedExpanded) {
      setNavigation(0)
      setIsFeedExpanded(false)
      listRef.current.scrollTop = 0
    } else {
      onExitConfirmDialog()
    }
  }

  const onKeyArrowDown = () => {
    const index = getCurrent().index
    if (isFeedExpanded && index + 2 < getAllElements().length) {
      setNavigation(getCurrent().index + 2)
    } else {
      setNavigation(1)
    }
    setFeedExpanded()
  }

  const onKeyArrowUp = () => {
    const index = getCurrent().index
    setNavigation(index - 2)
    setFeedExpanded()
  }

  const onKeyArrowRight = () => {
    const index = getCurrent().index
    setNavigation(index + 1)
    setFeedExpanded()
  }

  const onKeyArrowLeft = () => {
    const index = getCurrent().index
    setNavigation(index - 1)
    setFeedExpanded()
  }

  const setFeedExpanded = () => {
    if (getCurrent().index === 0) {
      setIsFeedExpanded(false)
    } else {
      setIsFeedExpanded(true)
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

  const allowUsage = () => {
    return isOnline || consentGranted
  }

  useSoftkey('Search', {
    right: allowUsage() ? i18n('softkey-settings') : '',
    onKeyRight: allowUsage() ? () => { window.location.hash = '/settings' } : null,
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    onKeyLeft: isRandomEnabled() ? goToRandomArticle : null,
    onKeyBackspace: !(query && current.type === 'INPUT') && onKeyBackSpace,
    onKeyArrowLeft: !query ? onKeyArrowLeft : navigatePrevious,
    onKeyArrowUp: !query ? onKeyArrowUp : navigatePrevious,
    onKeyArrowRight: !query ? onKeyArrowRight : navigateNext,
    onKeyArrowDown: !query ? onKeyArrowDown : navigateNext
  }, [current.type, query, isOnline, searchResults])

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

  const isExperimentGroup = isTrendingArticlesGroup() || isCuratedTopicsGroup()
  const hideW = (searchResults || !isOnline || (isFeedExpanded && isExperimentGroup))
  const showFeed = (isOnline && !searchResults && isExperimentGroup)

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: (hideW ? 'none' : 'block') }} />
      { (allowUsage()) && <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={query} onInput={onInput} data-selectable maxlength='255' /> }
      { (isOnline && searchResults) && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { !isOnline && <OfflinePanel /> }
      { showFeed && <Feed lang={lang} isExpanded={isFeedExpanded} containerRef={listRef} /> }
    </div>
  )
}
