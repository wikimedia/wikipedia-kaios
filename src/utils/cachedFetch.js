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
    // eslint-disable-next-line no-undef
    xhr.setRequestHeader('User-Agent', navigator.userAgent + ' WikipediaApp/' + APP_VERSION)
    xhr.send()
    xhr.addEventListener('load', () => {
      const transformResponse = transformFn(xhr.response)
      resolve(transformResponse)
      if (cache) {
        requestCache[url] = transformResponse
      }
      delete xhrList[timestamp]
    })
    xhr.addEventListener('error', () => {
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
