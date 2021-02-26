import { isProd, appVersion, sendErrorLog, isRequestHeaderDisabled } from 'utils'

// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
const noopAbort = () => {}

export const cachedFetch = (url, transformFn, cache = true) => {
  if (cache && requestCache[url]) {
    return [Promise.resolve(requestCache[url]), noopAbort]
  }

  const xhr = new XMLHttpRequest({ mozSystem: true })
  const promise = new Promise((resolve, reject) => {
    xhr.responseType = 'json'
    xhr.open('GET', url)
    if (!isRequestHeaderDisabled()) {
      xhr.setRequestHeader('User-Agent', `WikipediaApp/${appVersion()} ${navigator.userAgent}`)
      xhr.setRequestHeader('Referer', 'https://www.wikipedia.org')
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

  return [promise, abort, xhr]
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
