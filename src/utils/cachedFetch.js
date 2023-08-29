import {
  isProd, appVersion, sendErrorLog,
  isRequestHeaderDisabled, setUserCountry
} from 'utils'

// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
const noopAbort = () => {}

export const cachedFetch = (url, transformFn, cache = true, format = 'json', header = {}) => {
  if (cache && requestCache[url]) {
    return [Promise.resolve(requestCache[url]), noopAbort]
  }

  const xhr = new XMLHttpRequest({ mozSystem: true })
  const promise = new Promise((resolve, reject) => {
    xhr.responseType = format
    xhr.open('GET', url)
    if (!isRequestHeaderDisabled()) {
      xhr.setRequestHeader('User-Agent', `WikipediaApp/${appVersion()} ${navigator.userAgent}`)
      xhr.setRequestHeader('Referer', 'https://www.wikipedia.org')

      if (Object.keys(header).length) {
        for (const key in header) {
          xhr.setRequestHeader(key, header[key])
        }
      }
    }
    xhr.send()
    xhr.addEventListener('load', () => {
      // Accept all of 2xx and 3xx
      if (xhr.status >= 200 && xhr.status < 400) {
        const transformResponse = transformFn(xhr.response)
        resolve(transformResponse)
        if (cache) {
          requestCache[url] = transformResponse
        }

        // set user located country
        const GeoIP = xhr.getAllResponseHeaders().match(/GeoIP=(\w+)/)
        const userCountry = GeoIP && GeoIP[1]
        if (userCountry) {
          // in device, there is always user country set in response header
          // in desktop, it is always null
          setUserCountry(userCountry)
        }
      } else {
        reject(new Error('XHR Error: ' + xhr.status))
      }
      sendLogWhenError(xhr, url)
    })
    xhr.addEventListener('error', () => {
      sendLogWhenError(xhr, url)
      reject(new Error('XHR Error: ' + xhr.status))
    })
  })

  const abort = () => {
    if (xhr) {
      xhr.abort()
    }
  }

  return [promise, abort]
}

const sendLogWhenError = ({ status, response }, url) => {
  if (!isProd()) {
    return
  }

  if (response && response.error) {
    sendErrorLog({ message: response.error.info, url })
  } else if (status >= 500 && status < 600) {
    sendErrorLog({ message: `${status} ${url}`, url })
  }
}
