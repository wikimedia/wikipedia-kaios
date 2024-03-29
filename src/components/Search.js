import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, OfflinePanel, Consent, SearchLoading } from 'components'
import {
  useNavigation, useSearch, useI18n, useSoftkey,
  useOnlineStatus, useTracking, usePopup, useHistoryState,
  useConfirmDialog
} from 'hooks'
import {
  articleHistory, goto, getAppLanguage,
  isRandomEnabled, isConsentGranted,
  skipIntroAnchor
} from 'utils'
import { getRandomArticleTitle } from 'api'

export const Search = () => {
  const containerRef = useRef()
  const inputRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [current, setNavigation, getCurrent,, navigateNext, navigatePrevious] = useNavigation('Search', containerRef, listRef, 'y')
  const lang = getAppLanguage()
  const [inputText, setInputText] = useHistoryState('search-input-text')
  const [setQuery, searchResults, loading] = useSearch(lang, inputText)
  const [showConsentPopup, closeConsentPopup] = usePopup(Consent)
  const consentGranted = isConsentGranted()
  const showConfirmDialog = useConfirmDialog()
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
      } else if (isRandomEnabled() && !inputText) {
        goToRandomArticle()
      }
    }
  }

  const onKeyRight = () => {
    goto.settings()
  }

  const onKeyLeft = () => {
    goto.tips()
  }

  const onKeyBackSpace = () => {
    if (inputText) {
      onInput({ target: { value: '' } })
      setNavigation(0)
    } else {
      onExitConfirmDialog()
    }
  }

  const onKeyEndCall = () => {
    if (inputText && current.type === 'INPUT') {
      // simulate backspace event
      const element = inputRef.current
      if (element.value !== '' && element.selectionStart > 0) {
        const v = element.value
        const caret = element.selectionStart - 1
        element.value = v.substring(0, caret) + v.substring(caret + 1)
        element.setSelectionRange(caret, caret)
        element.dispatchEvent(new InputEvent('input'))
      }
    } else {
      onKeyBackSpace()
    }
  }

  const onKeyArrowDown = () => {
    navigateNext()
  }

  const onKeyArrowUp = () => {
    navigatePrevious()
  }

  const onInput = ({ target, isComposing }) => {
    setInputText(target.value)
    if (isOnline && !isComposing) {
      setQuery(target.value)
    }
  }

  const onExitConfirmDialog = () => {
    const isInputType = current.type === 'INPUT'
    if (isInputType) {
      setNavigation(-1)
    }
    showConfirmDialog({
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
    onKeyRight: allowUsage() ? onKeyRight : null,
    center: current.type === 'DIV' ? i18n('centerkey-select') : '',
    onKeyCenter,
    left: allowUsage() ? i18n('softkey-tips') : '',
    onKeyLeft: allowUsage() ? onKeyLeft : null,
    onKeyBackspace: !(inputText && current.type === 'INPUT') && onKeyBackSpace,
    onKeyEndCall: onKeyEndCall,
    onKeyArrowDown: !loading && searchResults && onKeyArrowDown,
    onKeyArrowUp: !loading && searchResults && onKeyArrowUp
  }, [current.type, inputText, isOnline, searchResults, loading])

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

  const hideW = searchResults || !isOnline || loading
  const showSearchBar = allowUsage()
  const showResultsList = isOnline && searchResults && !loading
  const showLoading = isOnline && loading
  const showOfflinePanel = !isOnline

  return (
    <div class='search' ref={containerRef}>
      <img class='double-u' src='images/w.svg' style={{ display: (hideW ? 'none' : 'block') }} />
      { showSearchBar && <input ref={inputRef} type='text' placeholder={i18n('search-placeholder')} value={inputText} onInput={onInput} data-selectable maxlength='255' /> }
      { showResultsList && <ListView header={i18n('header-search')} items={searchResults} containerRef={listRef} empty={i18n('no-result-found')} /> }
      { showLoading && <SearchLoading /> }
      { showOfflinePanel && <OfflinePanel /> }
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
