import { useKeys } from 'hooks/useKeys'

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
