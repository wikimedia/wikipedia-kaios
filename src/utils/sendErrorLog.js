import { appVersion, gitHash } from 'utils'

const intakeUrl = 'https://intake-logging.wikimedia.org/v1/events'

export const sendErrorLog = ({ message, stack = '', url = '' }) => {
  navigator.sendBeacon(intakeUrl, JSON.stringify({
    $schema: '/mediawiki/client/error/1.0.0',
    meta: {
      stream: 'kaios_app.error'
    },
    stack_trace: stack,
    message: message,
    url,
    tags: { app_version: appVersion(), git_hash: gitHash() }
  })
  )
}
