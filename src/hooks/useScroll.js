import { useState } from 'preact/hooks'

export const useScroll = (
  elementRef,
  step,
  axis
) => {
  const [position, setPosition] = useState(0)
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  const scrollDown = () => {
    setPosition(elementRef.current[prop] += step)
  }
  const scrollUp = () => {
    setPosition(elementRef.current[prop] -= step)
  }
  return [scrollDown, scrollUp, position]
}
