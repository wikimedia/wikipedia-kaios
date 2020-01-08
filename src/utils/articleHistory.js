const KEY = 'article-history'

const get = () => {
  return JSON.parse(localStorage.getItem(KEY))
}

const set = list => {
  localStorage.setItem(KEY, JSON.stringify(list))
}

const add = (lang, title) => {
  const list = JSON.parse(localStorage.getItem(KEY)) || []
  list.push({ lang, title })
  set(list)
}

const prev = () => {
  const list = get()
  if (!list.length) {
    return false
  }

  // remove the current article
  list.pop()

  // return the previous article
  const prevArticle = list.pop()

  set(list)

  return prevArticle
}

const clear = () => {
  localStorage.setItem(KEY, null)
}

const isEmpty = () => {
  return !(get() && get().length)
}

const hasPrev = () => {
  const list = get()
  return list && (list.length > 1)
}

const getPrev = () => {
  const list = get()
  return list[list.length - 2]
}

export const articleHistory = {
  get, set, add, prev, clear, isEmpty, hasPrev, getPrev
}
