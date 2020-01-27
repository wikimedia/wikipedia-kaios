import { h } from 'preact'
import { useState } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'

export const Gallery = ({ close, items }) => {
  const i18n = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)

  useSoftkey('Gallery', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    center: i18n.i18n('softkey-about'),
    onKeyCenter: () => {},
    onKeyArrowRight: () => { setCurrentIndex(currentIndex + 1) },
    onKeyArrowLeft: () => { setCurrentIndex(currentIndex - 1) }
  }, [currentIndex])

  console.log(items)
  return <div class='gallery'>
    <div class='header'>
      { items[currentIndex].description }
    </div>
    <div class='img'>
      <img src={items[currentIndex].thumbnail} />
    </div>
  </div>
}
