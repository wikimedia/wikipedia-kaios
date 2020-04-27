const intakeUrl = 'https://intake-logging.wikimedia.org'

export const sendErrorLog = ({ message, stack = '', url = '' }) => {
  navigator.sendBeacon(intakeUrl, JSON.stringify({
    $schema: '/mediawiki/client/error/1.0.0',
    meta: {
      stream: 'kaios_app.error'
    },
    error_class: stack,
    message,
    url,
    file_url: ''
  })
  )
}
