/**
 * The font size state is set to the HTML body to be made available
 * for all elements with adjustable text size. See fontsize.less for more info
 */

const KEY = 'article-textsize'
const DEFAULT_SIZE = 2
const [MIN_SIZE, MAX_SIZE] = [0, 6]

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

export const articleTextSize = {
  get, set, MAX_SIZE, MIN_SIZE
}
