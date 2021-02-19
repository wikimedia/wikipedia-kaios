import { h } from 'preact'
import { useSoftkey, useI18n } from 'hooks'
import { onboarding, goto } from 'utils'

export const Onboarding = () => {
  const i18n = useI18n()

  const exitOnboard = () => {
    onboarding.markAsDone()
    goto.search()
  }

  useSoftkey('Onboarding', {
    center: i18n('softkey-get-started'),
    onKeyCenter: exitOnboard
  })

  return (
    <div class='onboarding'>
      <div class='image'>
        <img src='images/onboarding-0.png' />
      </div>
      <div class='title'>
        {i18n('onboarding-0-title')}
      </div>
      <div class='description'>
        {i18n('onboarding-0-description')}
      </div>
    </div>
  )
}
