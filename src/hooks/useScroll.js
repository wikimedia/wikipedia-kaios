import { useKeys } from 'hooks'

export const useScroll = (
  elementRef,
  step
) => {
  useKeys({
    ArrowDown: () => {
      elementRef.current.scrollLeft += step
    },
    ArrowUp: () => {
      elementRef.current.scrollLeft -= step
    }
  })
}
