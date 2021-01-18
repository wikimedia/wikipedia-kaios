import { h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'
import { FontContext, DirectionContext } from 'contexts'

export const TextSize = ({ close, closeAll }) => {
  const i18n = useI18n()
  const { dirState } = useContext(DirectionContext)
  const { textSize, setTextSize } = useContext(FontContext)
  const [localTextSize, setLocalTextSize] = useState(textSize)
  const { MAX_SIZE, MIN_SIZE } = articleTextSize
  const sliderPortion = 100 / (MAX_SIZE - 1)
  const sliderValue = Array.from({ length: MAX_SIZE }, (v, i) => i * sliderPortion)

  const adjust = (step) => {
    const newSize = localTextSize + step
    if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
      setLocalTextSize(newSize)
    }
  }

  const onKeyCenter = () => {
    articleTextSize.set(localTextSize)
    setTextSize(localTextSize)
    closeAll()
  }

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    onKeyCenter,
    onKeyBackspace: close,
    onKeyArrowLeft: () => { adjust(-1) },
    onKeyArrowRight: () => { adjust(1) }
  }, [localTextSize])

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <bdi class={`textsize-preview font-size-${localTextSize}`}>
        {i18n('textsize-preview')}
      </bdi>
      <div class='slider-container'>
        <div class='slider'>
          <div class='filling' style={`width: ${sliderValue[localTextSize - 1]}%`} />
          <div class='circle' style={`${dirState === 'ltr' ? 'left' : 'right'}: ${sliderValue[localTextSize - 1]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
