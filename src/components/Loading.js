import { h } from 'preact'
import { useSoftkey, useI18n } from 'hooks'
export const Loading = ({ message }) => {
  const i18n = useI18n()

  useSoftkey('Loading', {
    left: i18n.i18n('softkey-close'),
    onKeyLeft: () => history.back()
  })

  return (
    <div class='loading-planet'>
      <img class='moon' src='images/loading-moon.svg' />
      <img class='earth' src='images/loading-earth.svg' />
      <img class='galaxy' src='images/loading-galaxy.svg' />
      <p class='message'>{message}</p>
    </div>
  )
}
