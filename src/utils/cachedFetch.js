// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
export const cachedFetch = (url, transformFn) => {
  if (requestCache[url]) {
    return Promise.resolve(requestCache[url])
  }
  return fetch(url)
    .then(response => response.json())
    .then(transformFn)
    .then(data => {
      requestCache[url] = data
      return data
    })
}
