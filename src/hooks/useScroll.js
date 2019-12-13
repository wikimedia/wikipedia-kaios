export const useScroll = (
  elementRef,
  step,
  axis
) => {
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'
  const scrollDown = () => {
    elementRef.current[prop] += step
  }
  const scrollUp = () => {
    elementRef.current[prop] -= step
  }
  return [scrollDown, scrollUp]
}
