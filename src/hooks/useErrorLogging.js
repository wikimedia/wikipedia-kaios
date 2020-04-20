import { useErrorBoundary } from 'preact/hooks'
import { isProd, sendErrorLog } from 'utils'

export const useErrorLogging = origin => {
  if (!isProd()) {
    return
  }

  useErrorBoundary((error, { componentStack }) => {
    sendErrorLog(error, `[${origin}] ${componentStack}`)
  })
}
