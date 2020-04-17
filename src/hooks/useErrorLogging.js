import { useErrorBoundary } from 'preact/hooks'
import { isProd, appVersion } from 'utils'

const intakeUrl = 'https://intake-logging.wikimedia.org'

export const useErrorLogging = origin => {
  if (!isProd()) {
    return
  }

  useErrorBoundary((error, { componentStack }) => {
    navigator.sendBeacon(intakeUrl, JSON.stringify({
      $schema: `/mediawiki/client/error/${appVersion}`,
      meta: {
        stream: 'mediawiki.client.error'
      },
      error_class: `[${origin}] ${componentStack}`,
      message: error,
      url: null,
      file_url: null
    })
    )
  })
}
