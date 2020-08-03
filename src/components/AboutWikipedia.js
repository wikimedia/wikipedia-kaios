import { h } from 'preact'
import { useSoftkey, useI18n, useRange } from 'hooks'
import { getAppDirection } from 'utils'

export const AboutWikipedia = ({ close }) => {
  const i18n = useI18n()
  const dir = getAppDirection()
  const [currentIndex, prevOnboard, nextOnboard] = useRange(0, 3)

  const getImageBackgroundStyle = index => {
    // only the first onboard image doesn't have background image
    return index ? { backgroundImage: `url(/images/onboarding-${index}-background.png)` } : {}
  }

  const [arrowLeftListener, arrowRightListener] = dir === 'ltr' ? ['onKeyArrowLeft', 'onKeyArrowRight'] : ['onKeyArrowRight', 'onKeyArrowLeft']
  const softkeyConfig = [
    { left: i18n('softkey-close'), onKeyLeft: close, right: i18n('softkey-next'), onKeyRight: nextOnboard, [arrowRightListener]: nextOnboard, onKeyBackspace: close },
    { left: i18n('softkey-back'), onKeyLeft: prevOnboard, [arrowLeftListener]: prevOnboard, right: i18n('softkey-next'), onKeyRight: nextOnboard, [arrowRightListener]: nextOnboard, onKeyBackspace: prevOnboard },
    { left: i18n('softkey-back'), onKeyLeft: prevOnboard, [arrowLeftListener]: prevOnboard, center: i18n('softkey-close'), onKeyCenter: close, onKeyBackspace: prevOnboard }
  ]
  useSoftkey('AboutWikipedia', softkeyConfig[currentIndex], [currentIndex], true)

  return (
    <div class='about-wikipedia'>
      <div class='header'>{i18n('about-wikipedia-header')}</div>
      <div class='body'>
        <div class='image' style={getImageBackgroundStyle(currentIndex)}>
          <img src={`/images/onboarding-${currentIndex}.png`} />
        </div>
        <bdi class='title'>
          {i18n(`onboarding-${currentIndex}-title`)}
        </bdi>
        <div class='description'>
          {i18n(`onboarding-${currentIndex}-description`)}
        </div>
      </div>
    </div>
  )
}
