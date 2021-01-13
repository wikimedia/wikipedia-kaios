import { h } from 'preact'
import { useContext } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'
import { articleTextSize } from 'utils'
import { DirectionContext } from 'contexts'

export const TextSize = ({ close }) => {
  const i18n = useI18n()
  const { dirState } = useContext(DirectionContext)
  const [textSize, setTextSize] = useArticleTextSize()
  const { MAX_SIZE } = articleTextSize
  const sliderPortion = 100 / (MAX_SIZE)
  const sliderValue = Array.from({ length: MAX_SIZE + 1 }, (v, i) => i * sliderPortion)
  const { onKeyArrowLeft, onKeyArrowRight } = articleTextSize.getSoftkeyEffect(setTextSize)

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    onKeyCenter: close,
    onKeyBackspace: close,
    onKeyArrowLeft,
    onKeyArrowRight
  })

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <bdi class='preview adjustable-font-size'>
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
