import { useState, useLayoutEffect } from 'preact/hooks'
import { useKeys } from 'hooks'

const DEVICE_WIDTH = 240

export const useArticlePagination = (
  elementRef,
  numOfSection
) => {
  const [currentSection, setCurrentSection] = useState(0)
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = 'scrollLeft'

  useKeys({
    ArrowDown: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] += DEVICE_WIDTH
      const after = elementRef.current[prop]

      // show the next section of the article
      if (previous === after) {
        showNextSection()
      }
    },
    ArrowUp: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] -= DEVICE_WIDTH
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
      const offset = DEVICE_WIDTH
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
