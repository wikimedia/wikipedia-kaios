import { useRef, useEffect } from 'preact/hooks'

const SCHEMA_NAME = 'InukaPageView'
const SCHEMA_REV = 19739286
const USER_ID_KEY = 'INUKA-PV-U'
const SESSION_ID_KEY = 'INUKA-PV-S'
const ONE_HOUR = 3600 * 1000
const BASE_URL = 'https://en.wikipedia.org/beacon/event'
const MAX_URL_LENGTH = 2000
// todo: find a place for a global debug flag in the app
const DEBUG = false

const generateId = () => {
  const rnds = new Uint16Array(5)
  crypto.getRandomValues(rnds)
  return (rnds[0] + 0x10000).toString(16).slice(1) +
          (rnds[1] + 0x10000).toString(16).slice(1) +
          (rnds[2] + 0x10000).toString(16).slice(1) +
          (rnds[3] + 0x10000).toString(16).slice(1) +
          (rnds[4] + 0x10000).toString(16).slice(1)
}

const getUserId = () => {
  let userId = localStorage.getItem(USER_ID_KEY)
  if (!userId) {
    userId = generateId()
    localStorage.setItem(USER_ID_KEY, userId)
  }
  return userId
}

const getSessionId = () => {
  const now = Date.now()
  let { id, ts } = JSON.parse(localStorage.getItem(SESSION_ID_KEY)) || {}
  if (!id || (now - ts) > ONE_HOUR) {
    // Never existed or is expired
    id = generateId()
  }
  ts = now
  localStorage.setItem(SESSION_ID_KEY, JSON.stringify({ id, ts }))
  return id
}

const isUrlValid = url => url.length <= MAX_URL_LENGTH

const buildBeaconUrl = event => {
  const queryString = encodeURIComponent(JSON.stringify(event))
  return `${BASE_URL}?${queryString};`
}

const sendEvent = event => {
  if (DEBUG) {
    console.log(event)
  } else {
    const url = buildBeaconUrl(event)
    if (isUrlValid(url)) {
      navigator.sendBeacon(url)
    }
  }
}

export const useTracking = (
  pageName,
  language = 'en',
  namespace = -1,
  sectionCount = 0,
  openedSections = {}
) => {
  const trackingRef = useRef()

  useEffect(() => {
    trackingRef.openedSectionCount = Object.keys(openedSections).length
  }, [openedSections])

  useEffect(() => {
    const start = Date.now()
    const userId = getUserId()
    const pageviewToken = generateId()
    let msPaused = 0
    let pausedTime
    const isSearch = pageName === 'Search'
    const onVisibilityChanged = () => {
      if (document.visibilityState === 'visible') {
        if (pausedTime) {
          const now = Date.now()
          msPaused += now - pausedTime
          pausedTime = null
        }
      } else {
        pausedTime = Date.now()
      }
    }
    document.addEventListener('visibilitychange', onVisibilityChanged)

    const sendBeacon = () => {
      const now = Date.now()
      const totalTime = now - start

      const event = {
        event: {
          /* eslint-disable camelcase */
          user_id: userId,
          session_id: getSessionId(),
          pageview_token: pageviewToken,
          client_type: 'kaios-app',
          app_version: '1.0.0',
          referring_domain: history.length > 1 ? 'kaios-app' : null,
          load_dt: new Date(start).toISOString(),
          page_open_time: Math.round(totalTime),
          page_visible_time: Math.round(totalTime - msPaused),
          section_count: sectionCount,
          opened_section_count: trackingRef.openedSectionCount,
          page_namespace: namespace,
          is_main_page: isSearch,
          is_search_page: isSearch
          /* eslint-enable camelcase */
        },
        revision: SCHEMA_REV,
        schema: SCHEMA_NAME,
        webHost: `${language}.wikipedia.org`,
        wiki: `${language}wiki`
      }

      sendEvent(event)

      document.removeEventListener('visibilitychange', onVisibilityChanged)
    }
    window.addEventListener('pagehide', sendBeacon)

    return sendBeacon
  }, [])
}
