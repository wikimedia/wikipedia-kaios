const KEY = 'usage-data-consent'

export const getConsentStatus = () => {
  return (localStorage.getItem(KEY) === 'true')
}

export const setConsentStatus = consent => {
  localStorage.setItem(KEY, !!consent)
}
