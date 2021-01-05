import { h } from 'preact'
import { useI18n, useSoftkey, useArticleTextSize } from 'hooks'
import { articleTextSize } from 'utils'
import { useEffect } from 'preact/hooks'

let originalFontSizeClass

export const TextSize = ({ close }) => {
  const i18n = useI18n()

  const [fontSizeClass, setFontSizeClass] = useArticleTextSize()

  useEffect(() => {
    originalFontSizeClass = articleTextSize.getFontSizeClassName()
  }, [])

  const onKeyFixedArrowLeft = () => {
    articleTextSize.adjust(-1)
    setFontSizeClass(articleTextSize.getFontSizeClassName())
  }

  const onKeyFixedArrowRight = () => {
    articleTextSize.adjust(1)
    setFontSizeClass(articleTextSize.getFontSizeClassName())
  }

  const onKeyBackspace = () => {
    const originalSizeInteger = parseTextSizeInteger(originalFontSizeClass)
    const currentSizeInteger = parseTextSizeInteger(articleTextSize.getFontSizeClassName())

    articleTextSize.adjust(originalSizeInteger - currentSizeInteger)
    setFontSizeClass(articleTextSize.getFontSizeClassName())
    close()
  }

  const sliderValue = ['0', '16.6', '33.2', '49', '66.6', '83.2', '94']
  const parseTextSizeInteger = (fontSizeClass) => {
    return parseInt(fontSizeClass.slice(-1))
  }

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
      <div class={`preview ${fontSizeClass}`}>
        {i18n('textsize-preview')}
      </div>
      <div class='slider-container'>
        <div class='slider'>
          <div class='circle' style={`left: ${sliderValue[parseTextSizeInteger(fontSizeClass) - 1]}%`} />
          <div class='filling' style={`width: ${sliderValue[parseTextSizeInteger(fontSizeClass) - 1]}%`} />
        </div>
      </div>
      <div class='labels'>
        <p>{i18n('textsize-label-small')}</p>
        <p>{i18n('textsize-label-large')}</p>
      </div>
    </div>
  </div>
}
