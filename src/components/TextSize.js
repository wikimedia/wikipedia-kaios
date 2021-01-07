import { h } from 'preact'
import { useEffect, useContext } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'
import { FontContext } from 'contexts'

let originalTextSize

export const TextSize = ({ close }) => {
  const i18n = useI18n()
  const { textSize, setTextSize } = useContext(FontContext)
  const sliderPortion = 100 / 6
  const sliderValue = Array.from({ length: 7 }, (v, i) => i * sliderPortion)

  const onKeyFixedArrowLeft = () => {
    articleTextSize.adjust(-1)
    setTextSize(articleTextSize.get())
  }

  const onKeyFixedArrowRight = () => {
    articleTextSize.adjust(1)
    setTextSize(articleTextSize.get())
  }

  const onKeyBackspace = () => {
    const currentTextSize = articleTextSize.get()

    articleTextSize.adjust(originalTextSize - currentTextSize)
    setTextSize(articleTextSize.get())
    close()
  }

  useEffect(() => {
    originalTextSize = articleTextSize.get()
  }, [])

  useSoftkey('TextSize', {
    center: i18n('softkey-ok'),
    onKeyCenter: close,
    onKeyBackspace,
    onKeyFixedArrowLeft,
    onKeyFixedArrowRight
  })

  return <div class='textsize'>
    <div class='header'>{i18n('header-textsize')}</div>
    <div class='content'>
      <div class='textsize-preview'>
        {i18n('textsize-preview')}
      </div>
      <div class='slider-container'>
        <div class='slider'>
          <div class='filling' style={`width: ${sliderValue[textSize - 1]}%`} />
          <div class='circle' style={`left: ${sliderValue[textSize - 1]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
