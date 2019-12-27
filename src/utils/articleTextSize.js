const KEY = 'article-textsize'
const DEFAULT_SIZE = 0

const get = () => {
  return parseInt(localStorage.getItem(KEY), 10) || DEFAULT_SIZE
}

const set = size => {
  localStorage.setItem(KEY, size)
}

const adjust = (containerRef, step = 1, update = true) => {
  // article-content class name
  const contentElement = containerRef.current.querySelector('.article-content')
  if (contentElement) {
    const adjust = parseFloat(window.getComputedStyle(contentElement).getPropertyValue('font-size')) + step
    contentElement.style.setProperty('font-size', `${adjust}px`)
  }

  if (update) {
    set(get() + step)
  }
}

const reset = (containerRef) => {
  adjust(containerRef, -get())
  set(DEFAULT_SIZE)
}

const init = containerRef => {
  if (get() !== DEFAULT_SIZE) {
    adjust(containerRef, get(), false)
  }
}
export default { get, set, adjust, reset, init }
