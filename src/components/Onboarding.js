import { h } from 'preact'
import { route } from 'preact-router'
import { useSoftkey, useI18n, useRange } from 'hooks'
import { onboarding } from 'utils'

export const Onboarding = () => {
  const i18n = useI18n()
  const [currentIndex, prevOnboard, nextOnboard] = useRange(0, 3)

  const exitOnboard = () => {
    onboarding.markAsDone()
    route('/')
  }

  const getImageBackgroundStyle = index => {
    // only the first onboard image doesn't have background image
    return index ? { backgroundImage: `url(/images/onboarding-${index}-background.png)` } : {}
  }

  const softkeyConfig = [
    { left: i18n('softkey-skip'), onKeyLeft: exitOnboard, right: i18n('softkey-next'), onKeyRight: nextOnboard, onKeyArrowRight: nextOnboard },
    { left: i18n('softkey-back'), onKeyLeft: prevOnboard, onKeyArrowLeft: prevOnboard, right: i18n('softkey-next'), onKeyRight: nextOnboard, onKeyArrowRight: nextOnboard },
    { left: i18n('softkey-back'), onKeyLeft: prevOnboard, onKeyArrowLeft: prevOnboard, center: i18n('softkey-get-started'), onKeyCenter: exitOnboard }
  ]
  useSoftkey('onboarding', softkeyConfig[currentIndex], [currentIndex], true)

  return (
    <div class='onboarding'>
      <div class='image' style={getImageBackgroundStyle(currentIndex)}>
        <img src={`/images/onboarding-${currentIndex}.png`} />
      </div>
      <div class='title'>
        {i18n(`onboarding-${currentIndex}-title`)}
      </div>
      <div class='description'>
        {i18n(`onboarding-${currentIndex}-description`)}
      </div>
      <div class='indicator'>
        <div class={`dot ${currentIndex === 0 ? 'selected' : ''}`} />
        <div class={`dot ${currentIndex === 1 ? 'selected' : ''}`} />
        <div class={`dot ${currentIndex === 2 ? 'selected' : ''}`} />
      </div>
    </div>
  )
}
