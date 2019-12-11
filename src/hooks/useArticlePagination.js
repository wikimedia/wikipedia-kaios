import { useState, useLayoutEffect } from 'preact/hooks'
import { useKeys } from 'hooks'

const DEVICE_WIDTH = 240

export const useArticlePagination = (
  elementRef,
  article,
  subTitle,
  showToc
) => {
  const [currentSection, setCurrentSection] = useState(findLocatedSection(article.toc, subTitle))
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = 'scrollLeft'
  const numOfSection = article.sections.length

  useKeys({
    ArrowDown: () => {
      if (showToc) return
      const previous = elementRef.current[prop]
      elementRef.current[prop] += DEVICE_WIDTH
      const after = elementRef.current[prop]

      // show the next section of the article
      if (previous === after) {
        showNextSection()
      }
    },
    ArrowUp: () => {
      if (showToc) return
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

    if (subTitle && sectionTitle !== subTitle) {
      const subTitleElement = Array
        .from(elementRef.current.querySelectorAll('h3'))
        .find(e => e.textContent === subTitle)

      subTitleElement && subTitleElement.scrollIntoView()

      // @todo replace the magic number with constant device width
      if (elementRef.current.scrollLeft % 240 === 216) {
        elementRef.current.scrollLeft += 24
      } else if (elementRef.current.scrollLeft % 240 === 16) {
        elementRef.current.scrollLeft -= 16
      }
    } else {
      elementRef.current.scrollLeft = 0
    }
  }, [subTitle])

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

  return [currentSection, setCurrentSection]
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
