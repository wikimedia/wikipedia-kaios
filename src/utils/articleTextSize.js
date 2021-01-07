/**
 * The font size state is set to the HTML body to be made available
 * for all elements with adjustable text size. See fontsize.less for more info
 */

const KEY = 'article-textsize'
const DEFAULT_SIZE = 3
const [MIN_SIZE, MAX_SIZE] = [1, 7]
let hasAdjusted = false

const get = () => {
  const fontSize = localStorage.getItem(KEY)
  if (fontSize === null) {
    return DEFAULT_SIZE
  }
  return parseInt(fontSize, 10)
}

const set = size => {
  localStorage.setItem(KEY, size)
}

const adjust = step => {
  const newSize = get() + step
  if (newSize < MIN_SIZE || newSize > MAX_SIZE) {
    return get()
  }

  set(newSize)
}

const getHasAdjusted = () => {
  return hasAdjusted
}

const setHasAdjusted = (adjustStatus) => {
  hasAdjusted = adjustStatus
}

export const articleTextSize = {
  get, set, adjust, getHasAdjusted, setHasAdjusted, MAX_SIZE
}
