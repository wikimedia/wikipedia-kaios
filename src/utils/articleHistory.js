import { normalizeTitle } from 'utils'

const MAX = 100
const list = []

const add = (lang, title) => {
  const normalizedTitle = normalizeTitle(title)
  list.push({ lang, title: normalizedTitle })
  if (list.length > MAX) {
    list.shift()
  }
}

const prev = () => {
  if (isEmpty()) {
    return false
  }

  // remove the current article
  list.pop()

  // return the previous article
  return list.pop()
}

const clear = () => {
  list.length = 0
}

const isEmpty = () => {
  return list.length === 0
}

const hasPrev = () => {
  return list.length > 1
}

const getPrev = () => {
  return list[list.length - 2]
}

export const articleHistory = {
  add, prev, clear, isEmpty, hasPrev, getPrev
}
