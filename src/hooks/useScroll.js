import { useKeys } from 'hooks'

export const useScroll = (
  elementRef,
  step,
  axis
) => {
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  useKeys({
    ArrowDown: () => {
      elementRef.current[prop] += step
    },
    ArrowUp: () => {
      elementRef.current[prop] -= step
    }
  })
}
