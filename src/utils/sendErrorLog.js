const intakeUrl = 'https://intake-logging.wikimedia.org'

export const sendErrorLog = (message, errorClass = '') => {
  navigator.sendBeacon(intakeUrl, JSON.stringify({
    $schema: '/mediawiki/client/error/1.0.0',
    meta: {
      stream: 'kaios_app.error'
    },
    error_class: errorClass,
    message,
    url: '',
    file_url: ''
  })
  )
}
