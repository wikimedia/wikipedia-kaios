import { useEffect } from 'preact/hooks'
import { sendEvent, isInstrumentationEnabled } from 'utils'

const SCHEMA_NAME = 'VirtualPageView_test '
const SCHEMA_REV = 19883675

export const useArticlePreviewTracking = (
  language
) => {
  if (!isInstrumentationEnabled()) {
    return
  }

  const logInukaPageView = () => {
    const event = {
      /* eslint-disable camelcase */
      access_method: 'mobile app',
      page_title: '',
      page_namespace: '',
      page_id: '',
      source_title: '',
      source_namespace: '',
      source_page_id: '',
      source_url: ''
      /* eslint-enable camelcase */
    }

    sendEvent(SCHEMA_NAME, SCHEMA_REV, language, event)
  }

  useEffect(() => {
    // When the preview is shown for at least 1 second
    // timeout
    logInukaPageView()

    return () => {
      // clear timeout
    }
  }, [])
}
