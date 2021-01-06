const KEY = 'article-textsize'
const DEFAULT_SIZE = 3
const [MIN_SIZE, MAX_SIZE] = [1, 7]

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

const getSoftkeyEffect = (onAdjust = () => {}) => {
  const onKeyArrowLeft = () => { adjust(-1); onAdjust(getFontSizeClassName()) }
  const onKeyArrowRight = () => { adjust(1); onAdjust(getFontSizeClassName()) }

  return {
    onKeyArrowLeft, onKeyArrowRight
  }
}

const getFontSizeClassName = () => {
  return `font-size-${get()}`
}

export const articleTextSize = {
  get, set, adjust, getSoftkeyEffect, getFontSizeClassName
}
