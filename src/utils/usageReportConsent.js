const KEY = 'usage-data-consent'

export const getConsentStatus = () => {
  const consent = (localStorage.getItem(KEY) === 'true')
  return consent
}

export const setConsentStatus = (consent) => {
  localStorage.setItem(KEY, consent)
}
