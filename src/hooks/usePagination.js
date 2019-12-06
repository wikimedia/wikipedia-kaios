import { useState, useLayoutEffect } from 'preact/hooks'
import { useKeys } from 'hooks'

export const usePagination = (
  elementRef,
  step,
  axis,
  numOfSection
) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'

  useKeys({
    ArrowDown: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] += step
      const after = elementRef.current[prop]

      // show the next section of the article
      if (previous === after) {
        showNextSection()
      }
    },
    ArrowUp: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] -= step
      const after = elementRef.current[prop]

      // show the previous section of the article
      if (previous === after) {
        showPrevSection()
      }
    }
  })

  useLayoutEffect(() => {
    if (isLastPage) {
      const scrollWidth = elementRef.current.scrollWidth
      const offset = step
      elementRef.current[prop] = scrollWidth - offset

      setIsLastPage(false)
    } else {
      elementRef.current[prop] = 0
    }
  }, [currentSection])

  const showNextSection = () => {
    const nextSection = currentSection + 1
    setCurrentSection(nextSection < numOfSection ? nextSection : 0)
  }

  const showPrevSection = () => {
    const prevSection = currentSection - 1
    if (prevSection >= 0) {
      setCurrentSection(prevSection)
      setIsLastPage(true)
    }
  }

  return [currentSection]
}
