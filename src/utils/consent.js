import { appVersion, appInstallId, sendEvent, getAppLanguage } from 'utils'

const KEY = 'usage-data-consent'

export const isConsentGranted = () => {
  return localStorage.getItem(KEY) !== null
}

export const grantConsent = () => {
  const version = appVersion()
  sendEvent('KaiOSAppFirstRun', 20158341, getAppLanguage(), {
    app_version: version,
    app_id: appInstallId()
  })
  localStorage.setItem(KEY, JSON.stringify({
    timestamp: Date.now(),
    version
  }))
}

// Those messages are not in i18n/*.json because they have a legal
// value and are translated by legal experts. (more languages to come)
export const consentMessages = {
  en: {
    'consent-policy-message': 'I understand and accept the terms of the Privacy Policy and consent to the processing of my personal information in accordance with such terms.',
    'consent-terms-message': 'I understand and accept the Terms of Service.'
  }
}
