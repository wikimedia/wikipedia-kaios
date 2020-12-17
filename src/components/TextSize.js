import { h } from 'preact'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'
import { articleTextSize } from 'utils'

export const TextSize = ({ close }) => {
  const i18n = useI18n()

  const [textSize, setTextSize] = useArticleTextSize('TextSize')
  const { onKeyArrowLeft, onKeyArrowRight } = articleTextSize.getSoftkeyEffect(setTextSize)
  const sliderValue = ['0', '16.6', '33.2', '49', '66.6', '83.2', '94']

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
      <div class={`preview font-size-${textSize}`}>
        {i18n('textsize-preview')}
      </div>
      <div class='slider-container'>
        <div class='slider'>
          <div class='circle' style={`left: ${sliderValue[textSize - 1]}%`} />
          <div class='filling' style={`width: ${sliderValue[textSize - 1]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
