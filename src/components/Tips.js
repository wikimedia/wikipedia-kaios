import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { useNavigation, useI18n, useSoftkey, usePopup } from 'hooks'
import { ListView } from 'components'
import { goto } from 'utils'

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

const tip = (origin, key, close, onNext, onTry) => {
  const i18n = useI18n()
  const aboutTip = key === 'about'

  const onTryHandler = () => {
    if (key === 'search') {
      close()
      onTry()
    } else {
      onTry(close)
    }
  }

  const getBackgroundStyle = () => {
    return { backgroundImage: aboutTip ? 'url(/images/onboarding-0.png)' : `url(images/tip-${key}-animation.gif` }
  }

  useSoftkey(origin, {
    left: i18n('softkey-back'),
    onKeyLeft: close,
    center: !aboutTip ? i18n('softkey-try') : '',
    onKeyCenter: !aboutTip ? onTryHandler : null,
    right: !aboutTip ? i18n('softkey-next') : '',
    onKeyRight: !aboutTip ? () => { close(); onNext() } : null,
    onKeyBackspace: close
  }, [])

  return (
    <div class={'tip'}>
      <div class='tip-media'>
        <div class={`tip-${aboutTip ? 'image' : 'animation'}`} style={getBackgroundStyle()} />
      </div>
      <div class={'tip-header'}>{i18n(`tip-${key}-header`)}</div>
      <p class={'tip-text'} dangerouslySetInnerHTML={{ __html: i18n(`tip-${key}-message`) }} />
    </div>
  )
}

const ReadPopup = ({ close, onSearchPopupSelected }) => {
  return tip('ReadPopup', 'read', close, onSearchPopupSelected, goto.randomArticle)
}

const SearchPopup = ({ close, onSwitchPopupSelected }) => {
  return tip('SearchPopup', 'search', close, onSwitchPopupSelected, goto.search)
}

const SwitchPopup = ({ close, showAboutWikipediaPopup }) => {
  return tip('SwitchPopup', 'switch', close, showAboutWikipediaPopup, goto.randomArticle)
}

const AboutPopup = ({ close }) => {
  return tip('AboutPopup', 'about', close)
}
