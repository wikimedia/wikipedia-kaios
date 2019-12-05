import { useState, useLayoutEffect } from 'preact/hooks'
import { useKeys } from 'hooks'

export const usePagination = (
  elementRef,
  step,
  axis,
  numOfPage
) => {
  const [currentPage, setCurrentPage] = useState(0)
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = axis === 'x' ? 'scrollLeft' : 'scrollTop'

  useKeys({
    ArrowDown: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] += step
      const after = elementRef.current[prop]

      // show the next page (section in article)
      if (previous === after) {
        showNextPage()
      }
    },
    ArrowUp: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] -= step
      const after = elementRef.current[prop]

      // show the previous page (section in article)
      if (previous === after) {
        showPrevPage()
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
  }, [currentPage])

  const showNextPage = () => {
    const nextSection = currentPage + 1
    setCurrentPage(nextSection < numOfPage ? nextSection : 0)
  }

  const showPrevPage = () => {
    const prevPage = currentPage - 1
    if (prevPage >= 0) {
      setCurrentPage(prevPage)
      setIsLastPage(true)
    }
  }

  return [currentPage, isLastPage]
}
