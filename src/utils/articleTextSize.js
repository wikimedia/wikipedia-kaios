const KEY = 'article-textsize'
const DEFAULT_SIZE = 2
const [MIN_SIZE, MAX_SIZE] = [0, 6]
const SELECTORS = '.adjustable-font-size'
const FONT_SIZE_ATTRIBUTE = 'data-font-size'

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

const adjustElement = step => {
  const elements = document.querySelectorAll(SELECTORS)
  Array.from(elements).forEach(element => {
    const adjust = parseFloat(element.getAttribute(FONT_SIZE_ATTRIBUTE)) + get() + step
    element.style.setProperty('font-size', `${adjust}px`)
  })
}

const adjust = step => {
  const newSize = get() + step
  if (newSize < MIN_SIZE || newSize > MAX_SIZE) {
    return
  }

  adjustElement(step)
  set(newSize)
}

const reset = () => {
  adjust(-get() + DEFAULT_SIZE)
  set(DEFAULT_SIZE)
}

const init = () => {
  const elements = document.querySelectorAll(SELECTORS)
  Array.from(elements).forEach(element => {
    if (!element.hasAttribute(FONT_SIZE_ATTRIBUTE)) {
      const fontSize = parseFloat(window.getComputedStyle(element).getPropertyValue('font-size'))
      element.setAttribute(FONT_SIZE_ATTRIBUTE, fontSize)
    }
  })

  adjust(0)
}

const getSoftkeyEffect = (onAdjust = () => {}) => {
  const onKeyArrowLeft = () => { adjust(-1); onAdjust(get()) }
  const onKeyArrowRight = () => { adjust(1); onAdjust(get()) }

  return {
    onKeyArrowLeft, onKeyArrowRight
  }
}

export const articleTextSize = {
  get, set, adjust, reset, init, getSoftkeyEffect
}
