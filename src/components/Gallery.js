import { h } from 'preact'
import { useState } from 'preact/hooks'
import { useI18n, useSoftkey, usePopup } from 'hooks'

const AboutContainer = ({ description, author, license, filePage, close }) => {
  const i18n = useI18n()

  useSoftkey('About', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    left: i18n.i18n('softkey-more-info'),
    onKeyLeft: () => { window.open(filePage) }
  })

  return (
    <div class='gallery-about'>
      <div class='header'>{i18n.i18n('gallery-about-header')}</div>
      {
        description && (
          <div>
            <div class='sub-header'>{i18n.i18n('gallery-description')}</div>
            <p class='description'>{description}</p>
          </div>
        )
      }
      {
        (author || license) && (
          <div>
            <div class='sub-header'>{i18n.i18n('gallery-author-license')}</div>
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

export const Gallery = ({ close, items }) => {
  const i18n = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showAboutPopup] = usePopup(AboutContainer, { stack: true })

  const onNextImage = () => {
    const nextIndex = currentIndex + 1
    setCurrentIndex(nextIndex % items.length)
  }

  const onPrevImage = () => {
    const prevIndex = currentIndex - 1
    setCurrentIndex(prevIndex < 0 ? 0 : prevIndex)
  }
  useSoftkey('Gallery', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-about'),
    onKeyCenter: () => { showAboutPopup({ ...items[currentIndex] }) },
    onKeyArrowRight: onNextImage,
    onKeyArrowLeft: onPrevImage
  }, [currentIndex])

  return (
    <div class='gallery'>
      {
        items[currentIndex].description && (
          <div class='header'>
            { items[currentIndex].description }
          </div>
        )
      }
      <div class='img'>
        <img src={items[currentIndex].thumbnail} />
      </div>
    </div>
  )
}
