import { useKeys } from 'hooks'

export const useScroll = (
  elementRef,
  step,
  axis,
  event
) => {
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  useKeys({
    ArrowDown: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] += step
      const after = elementRef.current[prop]

      // show the next page (section in article)
      if (previous === after) {
        event.nextPage()
        elementRef.current[prop] = 0
      }
    },
    ArrowUp: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] -= step
      const after = elementRef.current[prop]

      // show the previous page (section in article)
      if (previous === after) {
        event.prevPage()
        elementRef.current[prop] = 0
      }
    }
  })
}
