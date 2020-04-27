import { appVersion } from 'utils'

const intakeUrl = 'https://intake-logging.wikimedia.org/v1/events'

export const sendErrorLog = ({ message, stack = '', url = '' }) => {
  navigator.sendBeacon(intakeUrl, JSON.stringify({
    $schema: '/mediawiki/client/error/1.0.0',
    meta: {
      stream: 'kaios_app.error'
    },
    error_class: stack,
    message: message + `/${appVersion()}`,
    url,
    file_url: ''
  })
  )
}
