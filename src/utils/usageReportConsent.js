import { appVersion } from 'utils'

const KEY = 'usage-data-consent'

export const isConsentGranted = () => {
  return localStorage.getItem(KEY) !== null
}

export const grantConsent = () => {
  localStorage.setItem(KEY, JSON.stringify({
    timestamp: Date.now(),
    version: appVersion()
  }))
}
