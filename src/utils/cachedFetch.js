// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
export const cachedFetch = (url, transformFn) => {
  if (requestCache[url]) {
    return Promise.resolve(requestCache[url])
  }

  return new Promise(resolve => {
    const xhr = new XMLHttpRequest({ mozSystem: true })
    xhr.responseType = 'json'
    xhr.open('GET', url)
    xhr.send()
    xhr.onload = () => {
      resolve(requestCache[url] = transformFn(xhr.response))
    }
  })
}
