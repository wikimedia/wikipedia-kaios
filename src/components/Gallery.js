import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useI18n, useSoftkey, usePopup, useRange, useArticleMediaInfo } from 'hooks'

const MAX_DESCRIPTION_HEIGHT = 45

const AboutContainer = ({ lang, title, caption, fromCommon, close }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const mediaInfo = useArticleMediaInfo(lang, title, fromCommon)

  useSoftkey('About', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close,
    right: mediaInfo && mediaInfo.filePage ? i18n('softkey-more-info') : '',
    onKeyRight: () => {
      if (mediaInfo && mediaInfo.filePage) {
        window.open(mediaInfo.filePage)
      }
    }
  }, [mediaInfo])

  if (!mediaInfo) {
    return <LoadingAbout />
  }

  useLayoutEffect(() => {
    if (!containerRef.current) {
      return
    }

    const descriptionNode = containerRef.current.querySelector('.description')

    if (descriptionNode && descriptionNode.getBoundingClientRect().height > MAX_DESCRIPTION_HEIGHT) {
      descriptionNode.classList.add('clamp')
    }
  })

  return (
    <div class='gallery-about' ref={containerRef}>
      <div class='header'>{i18n('about-header')}</div>
      <div>
        <div class='sub-header'>{i18n('gallery-description')}</div>
        <p class='description'>{mediaInfo.description || caption || title}</p>
      </div>
      <div>
        <div class='sub-header'>{i18n('gallery-author-license')}</div>
        <p>
          {mediaInfo.author || i18n('gallery-unknown-author')}<br />
          {mediaInfo.license || i18n('gallery-unknown-license')}
        </p>
      </div>
    </div>
  )
}

const LoadingAbout = () => {
  const i18n = useI18n()
  return (
    <div class='gallery-about loading'>
      <div class='header'>{i18n('about-header')}</div>
      <div>
        <div class='sub-header'>{i18n('gallery-description')}</div>
        <p>
          <div class='loading-block full' />
        </p>
      </div>
      <div>
        <div class='sub-header'>{i18n('gallery-author-license')}</div>
        <p>
          <div class='loading-block full' />
          <div class='loading-block full last' />
        </p>
      </div>
    </div>
  )
}

export const Gallery = ({ close, closeAll, items, startFileName, lang }) => {
  const i18n = useI18n()
  const [
    currentIndex, onPrevImage, onNextImage
  ] = useRange(getInitialIndex(items, startFileName), items.length - 1)
  const [showAboutPopup] = usePopup(AboutContainer, { stack: true })

  useSoftkey('Gallery', {
    left: i18n('softkey-close'),
    onKeyLeft: closeAll,
    center: i18n('softkey-about'),
    onKeyCenter: () => showAboutPopup({ ...items[currentIndex], lang }),
    onKeyArrowRight: onNextImage,
    onKeyArrowLeft: onPrevImage,
    onKeyBackspace: close
  }, [currentIndex])

  return (
    <div class={`gallery ${items[currentIndex].caption ? 'hasHeader' : ''}`}>
      {
        items[currentIndex].caption && (
          <div class='header'>
            { items[currentIndex].caption }
          </div>
        )
      }
      <div class='img'>
        <img src={items[currentIndex].thumbnail} />
      </div>
    </div>
  )
}

const getInitialIndex = (items, fileName) => {
  if (fileName) {
    const index = items.findIndex(media => media.canonicalizedTitle === fileName)
    return index >= 0 ? index : 0
  }
  return 0
}
