import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { memo } from 'preact/compat'
import { useNavigation, useI18n, useSoftkey, usePopup, useOnlineStatus, useScroll } from 'hooks'
import { ListView, goToRandomArticle } from 'components'
import { goto, articleHistory } from 'utils'

export const Tips = () => {
  const containerRef = useRef()
  const listRef = useRef()
  const i18n = useI18n()
  const [, setNavigation, getCurrent] = useNavigation('Tips', containerRef, listRef, 'y')

  const [showReadPopup] = usePopup(ReadPopup, { mode: 'fullscreen' })
  const [showSearchPopup] = usePopup(SearchPopup, { mode: 'fullscreen' })
  const [showSwitchPopup] = usePopup(SwitchPopup, { mode: 'fullscreen' })
  const [showAboutWikipediaPopup] = usePopup(AboutPopup, { mode: 'fullscreen' })

  const onKeyCenter = () => {
    const { index } = getCurrent()
    const item = items[index]
    item.action()
  }

  const onReadPopupSelected = () => {
    showReadPopup({ onSearchPopupSelected })
  }

  const onSearchPopupSelected = () => {
    showSearchPopup({ onSwitchPopupSelected })
  }

  const onSwitchPopupSelected = () => {
    showSwitchPopup({ showAboutWikipediaPopup })
  }

  useSoftkey('Tips', {
    left: i18n('softkey-back'),
    onKeyLeft: () => history.back(),
    center: i18n('centerkey-select'),
    onKeyCenter,
    onKeyBackspace: () => history.back()
  })

  useEffect(() => {
    setNavigation(0)
  }, [])

  const items = [
    { title: i18n('tips-read'), action: onReadPopupSelected },
    { title: i18n('tips-search'), action: onSearchPopupSelected },
    { title: i18n('tips-switch'), action: onSwitchPopupSelected },
    { title: i18n('tips-about'), action: showAboutWikipediaPopup }
  ]

  return (
    <div class='tips' ref={containerRef}>
      <ListView
        header={i18n('tips-header')}
        items={items}
        containerRef={listRef}
      />
    </div>
  )
}

const tip = (origin, content, close, onNext, onTry) => {
  const i18n = useI18n()
  const aboutTip = origin === 'AboutPopup'
  const isOnline = useOnlineStatus()
  const textRef = useRef()
  const [scrollDown, scrollUp] = useScroll(textRef, 10, 'y')

  const onTryHandler = () => {
    articleHistory.clear()
    if (origin === 'SearchPopup') {
      close()
      onTry()
    } else if (origin === 'SwitchPopup') {
      onTry(close, true)
    } else {
      onTry(close)
    }
  }

  useSoftkey(origin, {
    left: i18n('softkey-back'),
    onKeyLeft: close,
    center: !aboutTip && isOnline ? i18n('softkey-try') : '',
    onKeyCenter: !aboutTip && isOnline ? onTryHandler : null,
    right: !aboutTip ? i18n('softkey-next') : '',
    onKeyRight: !aboutTip ? () => { close(); onNext() } : null,
    onKeyArrowUp: scrollUp,
    onKeyArrowDown: scrollDown,
    onKeyBackspace: close
  }, [isOnline])

  return (
    <div class={'tip'}>
      <div class='tip-media'>
        <div class={`${aboutTip ? 'tip-image' : 'tip-animation'}`} style={{ backgroundImage: `url(${content.image})` }} />
      </div>
      <div class={'tip-header'}>{i18n(content.header)}</div>
      <div class={'tip-text'} ref={textRef} dangerouslySetInnerHTML={{ __html: i18n(content.message) }} />
    </div>
  )
}

const ReadPopup = memo(({ close, onSearchPopupSelected }) => {
  const content = {
    image: 'images/tip-read-animation.gif',
    header: 'tip-read-header',
    message: 'tip-read-message'
  }
  return tip('ReadPopup', content, close, onSearchPopupSelected, goToRandomArticle)
})

const SearchPopup = memo(({ close, onSwitchPopupSelected }) => {
  const content = {
    image: 'images/tip-search-animation.gif',
    header: 'tip-search-header',
    message: 'tip-search-message'
  }
  return tip('SearchPopup', content, close, onSwitchPopupSelected, goto.search)
})

const SwitchPopup = memo(({ close, showAboutWikipediaPopup }) => {
  const content = {
    image: 'images/tip-switch-animation.gif',
    header: 'tip-switch-header',
    message: 'tip-switch-message'
  }
  return tip('SwitchPopup', content, close, showAboutWikipediaPopup, goToRandomArticle)
})

const AboutPopup = memo(({ close }) => {
  const content = {
    image: 'images/onboarding-0.png',
    header: 'tip-about-header',
    message: 'tip-about-message'
  }
  return tip('AboutPopup', content, close)
})
