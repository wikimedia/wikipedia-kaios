const KEY = 'article-textsize'
const DEFAULT_SIZE = 0

const get = () => {
  return parseInt(localStorage.getItem(KEY), 10) || DEFAULT_SIZE
}

const set = size => {
  localStorage.setItem(KEY, size)
}

const adjustElement = (selector, parentElement, step) => {
  const element = parentElement.querySelector(selector)

  if (element) {
    const adjust = parseFloat(window.getComputedStyle(element).getPropertyValue('font-size')) + step
    element.style.setProperty('font-size', `${adjust}px`)
  }
}

const adjust = (step = 1, update = true) => {
  adjustElement('.title', document, step)
  adjustElement('.desc', document, step)
  adjustElement('.article-content', document, step)

  if (update) {
    set(get() + step)
  }
}

const reset = () => {
  adjust(-get())
  set(DEFAULT_SIZE)
}

const init = () => {
  if (get() !== DEFAULT_SIZE) {
    adjust(get(), false)
  }
}

const getSoftkeyEffect = () => {
  const onKeyboard4 = () => adjust(1)
  const onKeyboard5 = () => reset()
  const onKeyboard6 = () => adjust(-1)

  return {
    onKeyboard4, onKeyboard5, onKeyboard6
  }
}

export default { get, set, adjust, reset, init, getSoftkeyEffect }
