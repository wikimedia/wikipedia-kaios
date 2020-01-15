import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { useSoftkey, useI18n } from 'hooks'
import { onboarding } from 'utils'

export const Onboarding = () => {
  const i18n = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const softkey = useSoftkey('onboarding')

  const exitOnboard = () => {
    onboarding.markAsDone()
    route('/')
  }

  const nextOnboard = () => {
    setCurrentIndex(currentIndex + 1)
  }

  const prevOnboard = () => {
    setCurrentIndex(currentIndex - 1)
  }

  const softkeyConfig = [
    { left: i18n.i18n('softkey-skip'), onKeyLeft: exitOnboard, right: i18n.i18n('softkey-next'), onKeyRight: nextOnboard },
    { left: i18n.i18n('softkey-back'), onKeyLeft: prevOnboard, right: i18n.i18n('softkey-next'), onKeyRight: nextOnboard },
    { left: i18n.i18n('softkey-back'), onKeyLeft: prevOnboard, right: i18n.i18n('softkey-next'), onKeyRight: nextOnboard },
    { left: i18n.i18n('softkey-back'), onKeyLeft: prevOnboard, center: i18n.i18n('softkey-get-started'), onKeyCenter: exitOnboard }
  ]

  useEffect(() => {
    softkey.dispatch({ type: 'replace', config: softkeyConfig[currentIndex] })
  }, [currentIndex])

  return (
    <div class='onboarding'>
      <div class='image' style={{ backgroundImage: `url('/images/onboarding-${currentIndex}-background.png')` }}>
        <img src={`/images/onboarding-${currentIndex}.png`} />
      </div>
      <div class='title'>
        {i18n.i18n(`onboarding-${currentIndex}-title`)}
      </div>
      <div class='description'>
        {i18n.i18n(`onboarding-${currentIndex}-description`)}
      </div>
    </div>
  )
}
