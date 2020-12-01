import { useEffect } from 'preact/hooks'
import { sendEvent, isInstrumentationEnabled } from 'utils'

const SCHEMA_NAME = 'VirtualPageView'
const SCHEMA_REV = 19883675

export const useArticlePreviewTracking = (
  page, source, language
) => {
  if (!isInstrumentationEnabled()) {
    return
  }

  if (page === undefined || source === undefined) {
    return
  }

  const logInukaPageView = () => {
    const event = {
      /* eslint-disable camelcase */
      access_method: 'mobile app',
      page_title: page.titles.canonical,
      page_namespace: page.namespace,
      page_id: page.id,
      source_title: source.articleTitle,
      source_namespace: source.namespace,
      source_page_id: source.id,
      source_url: location.href
      /* eslint-enable camelcase */
    }

    sendEvent(SCHEMA_NAME, SCHEMA_REV, language, event)
  }

  useEffect(() => {
    // When the preview is shown for at least 1 second
    const timeoutId = setTimeout(logInukaPageView, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [])
}
