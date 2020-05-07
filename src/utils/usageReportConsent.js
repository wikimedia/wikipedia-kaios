const KEY = 'usage-data-consent'
const confirmKey = 'usage-data-consent-confirmed-once'

export const getConsentStatus = () => {
  return (localStorage.getItem(KEY) === 'true')
}

export const setConsentStatus = consent => {
  localStorage.setItem(KEY, !!consent)
}

export const getConsentConfirmationStatus = () => {
  return !!localStorage.getItem(confirmKey)
}

export const setConsentConfirmationStatus = (confirmation) => {
  localStorage.setItem(confirmKey, confirmation)
}
