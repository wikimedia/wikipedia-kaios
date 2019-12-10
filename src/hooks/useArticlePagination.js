import { useState, useLayoutEffect } from 'preact/hooks'
import { useKeys } from 'hooks'

const DEVICE_WIDTH = 240

export const useArticlePagination = (
  elementRef,
  article,
  subTitle
) => {
  const [currentSection, setCurrentSection] = useState(findLocatedSection(article.toc, subTitle))
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = 'scrollLeft'
  const numOfSection = article.sections.length

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

  useLayoutEffect(() => {
    const sectionTitle = article.sections[currentSection].title

    // scroll when the subtitle is not on first page
    if (subTitle && sectionTitle !== subTitle) {
      const subTitleElement = Array
        .from(elementRef.current.querySelectorAll('h3'))
        .find(e => e.textContent === subTitle)

      subTitleElement && subTitleElement.scrollIntoView()

      if (elementRef.current.scrollLeft !== 0) {
        elementRef.current.scrollLeft += 24
      }
    }
  }, [])

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

const findLocatedSection = (toc, title) => {
  const index = toc.findIndex(item => {
    if (typeof item === 'string') {
      return item === title
    } else if (Array.isArray(item)) {
      return item.includes(title)
    }
  })

  return index + 1
}
