import { useKeys } from 'hooks/useKeys'

export const useScroll = (
  elementRef,
  step
) => {
  useKeys({
    ArrowDown: () => {
      elementRef.current.scrollTop += step
    },
    ArrowUp: () => {
      elementRef.current.scrollTop -= step
    }
  })
}
