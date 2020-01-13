import { h } from 'preact'
import { useState, useEffect } from 'preact/hooks'
import { route } from 'preact-router'
import { useSoftkey, useI18n } from 'hooks'
import { onboarding } from 'utils'

export const Onboarding = () => {
  const i18n = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const softkey = useSoftkey('origin')

  const items = [
    { title: i18n.i18n('onboarding-1-title'), description: i18n.i18n('onboarding-1-description'), imageUrl: '/images/onboarding-1.png' },
    { title: i18n.i18n('onboarding-2-title'), description: i18n.i18n('onboarding-2-description'), imageUrl: '/images/onboarding-2.png', backgroundImageUrl: '/images/onboarding-2-background.png' },
    { title: i18n.i18n('onboarding-3-title'), description: i18n.i18n('onboarding-3-description'), imageUrl: '/images/onboarding-3.png', backgroundImageUrl: '/images/onboarding-3-background.png' },
    { title: i18n.i18n('onboarding-4-title'), description: i18n.i18n('onboarding-4-description'), imageUrl: '/images/onboarding-4.png', backgroundImageUrl: '/images/onboarding-4-background.png' }
  ]

  const softkeyConfig = [
    { left: i18n.i18n('softkey-skip'), onKeyLeft: () => { onboarding.set(true); route('/') }, right: i18n.i18n('softkey-next'), onKeyRight: () => { setCurrentIndex(currentIndex + 1) } },
    { left: i18n.i18n('softkey-back'), onKeyLeft: () => { setCurrentIndex(currentIndex - 1) }, right: i18n.i18n('softkey-next'), onKeyRight: () => { setCurrentIndex(currentIndex + 1) } },
    { left: i18n.i18n('softkey-back'), onKeyLeft: () => { setCurrentIndex(currentIndex - 1) }, right: i18n.i18n('softkey-next'), onKeyRight: () => { setCurrentIndex(currentIndex + 1) } },
    { left: i18n.i18n('softkey-back'), onKeyLeft: () => { setCurrentIndex(currentIndex - 1) }, center: i18n.i18n('softkey-get-started'), onKeyCenter: () => { onboarding.set(true); route('/') } }
  ]

  useEffect(() => {
    softkey.dispatch({ type: 'replace', config: softkeyConfig[currentIndex] })
  }, [currentIndex])

  return <div class='onboarding'>
    <div class='image' style={{ backgroundImage: `url(${items[currentIndex].backgroundImageUrl})` }}>
      <img src={items[currentIndex].imageUrl} />
    </div>
    <div class='title'>{items[currentIndex].title}</div>
    <div class='description'>{i18n.i18n(`onboarding-${currentIndex + 1}-description`)}</div>
  </div>
}
