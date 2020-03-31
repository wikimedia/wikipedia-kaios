import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useI18n, useSoftkey, usePopup, useRange } from 'hooks'

const MAX_DESCRIPTION_HEIGHT = 45

const AboutContainer = ({ author, description, license, filePage, close }) => {
  const i18n = useI18n()
  const containerRef = useRef()

  useSoftkey('About', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    right: i18n('softkey-more-info'),
    onKeyRight: () => { window.open(filePage) }
  })

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
      {
        description && (
          <div>
            <div class='sub-header'>{i18n('gallery-description')}</div>
            <p class='description'>{description}</p>
          </div>
        )
      }
      {
        (author || license) && (
          <div>
            <div class='sub-header'>{i18n('gallery-author-license')}</div>
            <p>
              {author}{ author && <br /> }
              {license}
            </p>
          </div>
        )
      }
    </div>
  )
}

export const Gallery = ({ close, items, startFileName }) => {
  const i18n = useI18n()
  const [
    currentIndex, onPrevImage, onNextImage
  ] = useRange(getInitialIndex(items, startFileName), items.length - 1)
  const [showAboutPopup] = usePopup(AboutContainer, { stack: true })

  const containsNecessaryFields = () => {
    return items[currentIndex].description || items[currentIndex].author || items[currentIndex].license
  }

  useSoftkey('Gallery', {
    left: i18n('softkey-close'),
    onKeyLeft: close,
    center: containsNecessaryFields() ? i18n('softkey-about') : '',
    onKeyCenter: containsNecessaryFields() ? () => { showAboutPopup({ ...items[currentIndex] }) } : null,
    onKeyArrowRight: onNextImage,
    onKeyArrowLeft: onPrevImage
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
