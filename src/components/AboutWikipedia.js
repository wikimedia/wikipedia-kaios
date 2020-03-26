import { h } from 'preact'
import { useSoftkey, useI18n, useRange } from 'hooks'

export const AboutWikipedia = () => {
  const i18n = useI18n()
  const [currentIndex, prevOnboard, nextOnboard] = useRange(0, 3)

  const getImageBackgroundStyle = index => {
    // only the first onboard image doesn't have background image
    return index ? { backgroundImage: `url(/images/onboarding-${index}-background.png)` } : {}
  }

  const softkeyConfig = [
    { left: i18n.i18n('softkey-close'), onKeyLeft: () => history.back(), right: i18n.i18n('softkey-next'), onKeyRight: nextOnboard, onKeyArrowRight: nextOnboard },
    { left: i18n.i18n('softkey-back'), onKeyLeft: prevOnboard, onKeyArrowLeft: prevOnboard, right: i18n.i18n('softkey-next'), onKeyRight: nextOnboard, onKeyArrowRight: nextOnboard },
    { left: i18n.i18n('softkey-back'), onKeyLeft: prevOnboard, onKeyArrowLeft: prevOnboard, center: i18n.i18n('softkey-close'), onKeyCenter: () => history.back() }
  ]
  useSoftkey('AboutWikipedia', softkeyConfig[currentIndex], [currentIndex], true)

  return (
    <div class='about-wikipedia'>
      <div class='header'>{i18n.i18n('about-wikipedia-header')}</div>
      <div class='body'>
        <div class='image' style={getImageBackgroundStyle(currentIndex)}>
          <img src={`/images/onboarding-${currentIndex}.png`} />
        </div>
        <div class='title'>
          {i18n.i18n(`onboarding-${currentIndex}-title`)}
        </div>
        <div class='description'>
          {i18n.i18n(`onboarding-${currentIndex}-description`)}
        </div>
      </div>
    </div>
  )
}
