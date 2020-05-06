const BASE_URL = 'https://en.wikipedia.org/beacon/event'
const MAX_URL_LENGTH = 2000

const isUrlValid = url => url.length <= MAX_URL_LENGTH

const buildBeaconUrl = event => {
  const queryString = encodeURIComponent(JSON.stringify(event))
  return `${BASE_URL}?${queryString}`
}

export const sendEvent = (schema, revision, language, event) => {
  const url = buildBeaconUrl({
    schema,
    revision,
    event,
    webHost: `${language}.wikipedia.org`,
    wiki: `${language}wiki`
  })
  if (isUrlValid(url)) {
    navigator.sendBeacon(url)
  }
}
