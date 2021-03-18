import { isProd } from 'utils'

const intakeUrl = 'https://intake-analytics.wikimedia.org/v1/events' + (isProd() ? '?hasty=true' : '')

export const sendEvent = ($schema, stream, event) => {
  const body = JSON.stringify({
    $schema,
    meta: { stream },
    event
  })
  navigator.sendBeacon(intakeUrl, body)
}
