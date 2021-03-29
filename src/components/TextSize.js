import { h } from 'preact'
import { useState, useContext } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'
import { FontContext, DirectionContext } from 'contexts'

export const TextSize = ({ close, closeAll }) => {
  const i18n = useI18n()
  const { dirState } = useContext(DirectionContext)
  const { textSize, setTextSize } = useContext(FontContext)
  const [localTextSize] = useState(textSize)
  const { MAX_SIZE, MIN_SIZE } = articleTextSize
  const sliderPortion = 100 / (MAX_SIZE)
  const sliderValue = Array.from({ length: MAX_SIZE + 1 }, (v, i) => i * sliderPortion)

  const adjust = (step) => {
    const newSize = textSize + step
    if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
      setTextSize(newSize)
    }
  }

  const onKeyCenter = () => {
    articleTextSize.set(textSize)
    closeAll()
  }

  const onDiscard = () => {
    articleTextSize.set(localTextSize)
    setTextSize(localTextSize)
    close()
  }

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    left: i18n('softkey-cancel'),
    onKeyCenter,
    onKeyLeft: onDiscard,
    onKeyBackspace: onDiscard,
    onKeyArrowLeft: () => { adjust(-1) },
    onKeyArrowRight: () => { adjust(1) }
  }, [textSize])

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <bdi class={`textsize-preview font-size-${textSize + 1}`}>
        {i18n('textsize-preview')}
      </bdi>
      <div class='slider-container'>
        <div class='slider'>
          <div class='filling' style={`width: ${sliderValue[textSize]}%`} />
          <div class='circle' style={`${dirState === 'ltr' ? 'left' : 'right'}: ${sliderValue[textSize]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
