import { useErrorBoundary } from 'preact/hooks'
import { isProd, sendErrorLog } from 'utils'

export const useErrorLogging = () => {
  if (!isProd()) {
    return
  }

  return useErrorBoundary(sendErrorLog)
}
