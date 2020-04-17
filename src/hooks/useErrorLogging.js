import { useErrorBoundary } from 'preact/hooks'
import { isProd, appVersion } from 'utils'

const intakeUrl = 'https://intake-logging.wikimedia.org'

export const useErrorLogging = () => {
  if (!isProd()) {
    return
  }

  useErrorBoundary((error, { componentStack }) => {
    navigator.sendBeacon(intakeUrl, JSON.stringify({
      $schema: `/mediawiki/client/error/${appVersion}`,
      meta: {
        stream: 'mediawiki.client.error'
      },
      error_class: componentStack,
      message: error,
      url: null,
      file_url: null
    })
    )
  })
}
