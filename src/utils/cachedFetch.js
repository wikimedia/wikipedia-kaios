import { isProd, appVersion, sendErrorLog } from 'utils'

// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
const xhrList = {}

export const cachedFetch = (url, transformFn, abortAllXhr = false, cache = true) => {
  if (abortAllXhr) {
    abortAllFetch()
  }

  if (cache && requestCache[url]) {
    return Promise.resolve(requestCache[url])
  }

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest({ mozSystem: true })
    const timestamp = (new Date()).valueOf()
    xhrList[timestamp] = xhr
    xhr.responseType = 'json'
    xhr.open('GET', url)
    if (isProd()) {
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
      delete xhrList[timestamp]
    })
    xhr.addEventListener('error', () => {
      sendLogWhenError(xhr, url)
      delete xhrList[timestamp]
      reject(new Error('XHR Error: ' + xhr.status))
    })
  })
}

const abortAllFetch = () => {
  Object.keys(xhrList).forEach(key => {
    xhrList[key].abort()
    delete xhrList[key]
  })
}

const sendLogWhenError = ({ status, response }, url) => {
  if (!isProd()) {
    return
  }

  if (response.error) {
    sendErrorLog(response.error.info)
  } else if (status >= 500 && status < 600) {
    sendErrorLog(`${status} ${url}`)
  }
}
