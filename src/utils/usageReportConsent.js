import { appVersion, sendEvent, getAppLanguage } from 'utils'

const KEY = 'usage-data-consent'

export const isConsentGranted = () => {
  return localStorage.getItem(KEY) !== null
}

export const grantConsent = () => {
  const version = appVersion()
  sendEvent('KaiOSAppConsent', 20122102, getAppLanguage(), { version })
  localStorage.setItem(KEY, JSON.stringify({
    timestamp: Date.now(),
    version: appVersion()
  }))
}
