import { h } from 'preact'
import { memo } from 'preact/compat'

export const Loading = memo(({ message }) => {
  return (
    <div class='loading-planet'>
      <img class='moon' src='images/loading-moon.svg' />
      <img class='earth' src='images/loading-earth.svg' />
      <img class='galaxy' src='images/loading-galaxy.svg' />
      <p class='message'>{message}</p>
    </div>
  )
})
