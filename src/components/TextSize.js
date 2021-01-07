import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'
import { FontContext, DirectionContext } from 'contexts'

let originalTextSize

export const TextSize = ({ close, closeAll }) => {
  const i18n = useI18n()
  const { dirState } = useContext(DirectionContext)
  const { textSize, setTextSize } = useContext(FontContext)
  const { MAX_SIZE } = articleTextSize
  const sliderPortion = 100 / (MAX_SIZE - 1)
  const sliderValue = Array.from({ length: MAX_SIZE }, (v, i) => i * sliderPortion)

  const onKeyArrowLeft = () => {
    articleTextSize.adjust(-1)
    setTextSize(articleTextSize.get())
  }

  const onKeyArrowRight = () => {
    articleTextSize.adjust(1)
    setTextSize(articleTextSize.get())
  }

  const onKeyBackspace = () => {
    const currentTextSize = articleTextSize.get()

    articleTextSize.adjust(originalTextSize - currentTextSize)
    setTextSize(articleTextSize.get())
    close()
  }

  const onKeyCenter = () => {
    articleTextSize.setHasAdjusted(true)
    closeAll()
  }

  useEffect(() => {
    originalTextSize = articleTextSize.get()
  }, [])

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    onKeyCenter,
    onKeyBackspace,
    onKeyArrowLeft,
    onKeyArrowRight
  })

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <bdi class='textsize-preview'>
        {i18n('textsize-preview')}
      </bdi>
      <div class='slider-container'>
        <div class='slider'>
          <div class='filling' style={`width: ${sliderValue[textSize - 1]}%`} />
          <div class='circle' style={`${dirState === 'ltr' ? 'left' : 'right'}: ${sliderValue[textSize - 1]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
