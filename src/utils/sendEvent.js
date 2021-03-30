import { isProd } from 'utils'

const intakeUrl = 'https://intake-analytics.wikimedia.org/v1/events' + (isProd() ? '?hasty=true' : '')

export const sendEvent = ($schema, stream, legacySchemaName, lang, event) => {
  const body = JSON.stringify({
    $schema,
    schema: legacySchemaName,
    meta: { stream },
    client_dt: new Date().toISOString(),
    webHost: window.location.hostname,
    wiki: `${lang}wiki`,
    event
  })
  navigator.sendBeacon(intakeUrl, body)
}
