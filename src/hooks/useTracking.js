import { useRef, useEffect } from 'preact/hooks'
import {
  appVersion, appInstallId, generateRandomId, sendEvent,
  isInstrumentationEnabled, isConsentGranted, isProd
} from 'utils'

const SCHEMA_NAME = 'InukaPageView'
const SCHEMA_REV = 21188117
const SESSION_ID_KEY = 'INUKA-PV-S'
const ONE_HOUR = 3600 * 1000

const getSessionId = () => {
  const now = Date.now()
  let changed = false
  let { id, ts } = JSON.parse(localStorage.getItem(SESSION_ID_KEY)) || {}
  if (!id || (now - ts) > ONE_HOUR) {
    // Never existed or is expired
    id = generateRandomId()
    changed = true
  }
  ts = now
  localStorage.setItem(SESSION_ID_KEY, JSON.stringify({ id, ts }))
  return [id, changed]
}

export const useTracking = (
  pageName,
  language,
  namespace = -1,
  sectionCount = 0,
  openedSections = {}
) => {
  if (!isInstrumentationEnabled() || !isConsentGranted()) {
    return
  }
  const userId = appInstallId()
  const isSearch = pageName === 'Search'

  const trackingRef = useRef()
  useEffect(() => {
    trackingRef.openedSectionCount = Object.keys(openedSections).length
  }, [openedSections])

  let start
  let pageviewToken
  let msPaused
  let pausedTime

  const initEvent = () => {
    start = Date.now()
    pageviewToken = generateRandomId()
    msPaused = 0
    pausedTime = null
  }

  const onShow = () => {
    const [, changed] = getSessionId()
    if (changed) {
      // The page has been hidden for too long, the session has expired.
      // We consider this a new pageview, reset the event data (start time, etc)
      initEvent()
    } else if (pausedTime) {
      const now = Date.now()
      msPaused += now - pausedTime
      pausedTime = null
    }
  }

  const onHide = () => {
    pausedTime = Date.now()
    // Log the event now since we don't know if the user is ever coming back.
    logInukaPageView()
  }

  const onVisibilityChanged = () => {
    document.visibilityState === 'visible' ? onShow() : onHide()
  }

  const logInukaPageView = () => {
    const now = Date.now()
    const totalTime = now - start
    const [sessionId] = getSessionId()

    const event = {
      /* eslint-disable camelcase */
      user_id: userId,
      session_id: sessionId,
      pageview_token: pageviewToken,
      client_type: 'kaios-app',
      app_version: appVersion(),
      referring_domain: 'kaios-app',
      load_dt: new Date(start).toISOString(),
      page_open_time: Math.round(totalTime),
      page_visible_time: Math.round(totalTime - msPaused),
      section_count: sectionCount,
      opened_section_count: trackingRef.openedSectionCount,
      page_namespace: namespace,
      is_main_page: isSearch,
      is_search_page: isSearch,
      is_production: isProd()
      /* eslint-enable camelcase */
    }

    sendEvent(SCHEMA_NAME, SCHEMA_REV, language, event)
  }

  useEffect(() => {
    // Make sure the session id is set and its timer is updated
    getSessionId()
    initEvent()
    document.addEventListener('visibilitychange', onVisibilityChanged)
    return () => {
      document.removeEventListener('visibilitychange', onVisibilityChanged)
      logInukaPageView()
    }
  }, [])
}
