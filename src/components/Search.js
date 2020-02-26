import { h } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { ListView, Video } from 'components'
import {
  useNavigation, useSearch, useI18n,
  useSoftkey, useOnlineStatus, usePopup,
  useMotd
} from 'hooks'
import { articleHistory, goto } from 'utils'
import { getRandomArticleTitle } from 'api'

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
  const carouselRef = useRef()
  const [showVideo] = usePopup(Video, { mode: 'fullscreen' })
  const [motd] = useMotd()
  // const podt = usePodt()
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

    if (key === 'motd') {
      showVideo({ items: motd })
    } else if (key === 'potd') {
      // todo
    } else if (index) {
      goto.article(lang, key)
    }
  }

  const goToRandomArticle = () => {
    getRandomArticleTitle(lang).then(title => {
      goto.article(lang, title)
    })
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
    onKeyLeft: goToRandomArticle
  }, [current.type])

  useEffect(() => {
    articleHistory.clear()
    setNavigation(0)
  }, [])

  useEffect(() => {
    if (current.key === 'motd') {
      carouselRef.current.style.marginLeft = '35px'
    } else if (current.key === 'potd') {
      carouselRef.current.style.marginLeft = '-140px'
    }
  }, [current])

  return (
    <div class='search'>
      {/* <img class='double-u' src='images/w.svg' style={{ display: ((searchResults || !isOnline) ? 'none' : 'block') }} /> */}
      <input ref={inputRef} type='text' placeholder={i18n.i18n('search-placeholder')} value={query} onInput={onInput} data-selectable />
      { (isOnline && searchResults) && <ListView header={i18n.i18n('header-search')} items={searchResults} containerRef={containerRef} empty={i18n.i18n('no-result-found')} /> }
      { !isOnline && <SearchOfflinePanel /> }

      {
        (!query && !searchResults) && (
          <div class='carousel-container'>
            <div class='carousel' ref={carouselRef}>
              <div class='item motd' data-selectable data-selected-key='motd' key='motd'>
                <figure class='mw-halign-right' data-selected='true'>
                  <div class='image'>
                    {
                      motd.length ? <img src={motd[0].poster} /> : null
                    }
                  </div>
                  <figcaption>
                    <p class='title'>Video of the day</p>
                    <p class='description'>From Wikimedia Commons</p>
                  </figcaption>
                </figure>
              </div>
              <div class='item potd' data-selectable data-selected-key='potd' key='potd'>
                <figure class='mw-halign-right' data-selected='true'>
                  <div class='image'>
                    <img src='https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/Copyright.svg/100px-Copyright.svg.png' />
                  </div>
                  <figcaption>
                    <p class='title'>Picture of the day</p>
                    <p class='description'>From Wikimedia Commons</p>
                  </figcaption>
                </figure>
              </div>
            </div>
          </div>
        )
      }
    </div>
  )
}
