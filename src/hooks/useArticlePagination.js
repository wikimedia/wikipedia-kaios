import { useState, useLayoutEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'

const DEVICE_WIDTH = 240

export const useArticlePagination = (
  elementRef,
  article,
  subTitle
) => {
  const [currentSection, setCurrentSection] = useState(findSection(article.toc, subTitle))
  const [isLastPage, setIsLastPage] = useState(0)
  const prop = 'scrollLeft'
  const numOfSection = article.sections.length

  useSoftkey('Article', {
    onKeyArrowDown: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] += DEVICE_WIDTH
      const after = elementRef.current[prop]

      // show the next section of the article
      if (previous === after) {
        showNextSection()
      }
    },
    onKeyArrowUp: () => {
      const previous = elementRef.current[prop]
      elementRef.current[prop] -= DEVICE_WIDTH
      const after = elementRef.current[prop]

      // show the previous section of the article
      if (previous === after) {
        showPrevSection()
      }
    }
  }, [currentSection])

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
        .from(elementRef.current.querySelectorAll('h3, h4'))
        .find(e => e.textContent === subTitle)

      subTitleElement && subTitleElement.scrollIntoView()

      // @todo replace the magic number with constant device width
      if (elementRef.current.scrollLeft % 240 === 216) {
        elementRef.current.scrollLeft += 24
      } else {
        elementRef.current.scrollLeft -= elementRef.current.scrollLeft % 240
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

const findSection = (toc, title) => {
  if (!title) {
    return 0
  }
  return toc.find(item => item.line === title).sectionIndex
}
