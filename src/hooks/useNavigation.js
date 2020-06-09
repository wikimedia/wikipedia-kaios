import { useState, useEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'

export const useNavigation = (origin, containerRef, listRef, axis, elementsSelector = '[data-selectable]') => {
  const [current, setCurrent] = useState({ type: null, index: 0, key: null })

  const getAllElements = () => containerRef.current.querySelectorAll(elementsSelector)

  const getSelectedElement = () => containerRef.current.querySelector('[nav-selected=true]')

  const getTheIndexOfTheSelectedElement = () => {
    const element = getSelectedElement()
    return element ? parseInt(element.getAttribute('nav-index')) : 0
  }

  const setNavigation = index => selectElement(getAllElements()[index] || document.body)

  const navigatePrevious = () => {
    const allElements = getAllElements()
    const currentIndex = getTheIndexOfTheSelectedElement()

    const setIndex = (currentIndex === 0) ? allElements.length - 1 : currentIndex - 1
    return selectElement(allElements[setIndex] || allElements[0], setIndex)
  }

  const navigateNext = () => {
    const allElements = getAllElements()
    const currentIndex = getTheIndexOfTheSelectedElement()

    const setIndex = (currentIndex + 1 > allElements.length - 1) ? 0 : currentIndex + 1
    return selectElement(allElements[setIndex] || allElements[0], setIndex)
  }

  const selectElement = (selectElement, setIndex = 0) => {
    if (selectElement) {
      [].forEach.call(getAllElements(), (element, index) => {
        const selectThisElement = element === selectElement
        element.setAttribute('nav-selected', selectThisElement)
        element.setAttribute('nav-index', index)
        if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
          if (selectThisElement) {
            element.focus()
            element.selectionStart = element.selectionEnd = element.value.length
          } else {
            element.blur()
          }
        }
      })
      setCurrent({ type: selectElement.tagName, index: setIndex, key: selectElement.getAttribute('data-selected-key') })
    } else {
      setNavigation(0)
    }
  }

  const getCurrent = () => {
    const element = getSelectedElement()
    return {
      type: element.tagName,
      index: parseInt(element.getAttribute('nav-index'), 10),
      key: element.getAttribute('data-selected-key')
    }
  }

  const previousKey = axis === 'x' ? 'onKeyArrowLeft' : 'onKeyArrowUp'
  const nextKey = axis === 'x' ? 'onKeyArrowRight' : 'onKeyArrowDown'
  useSoftkey(origin, {
    [previousKey]: navigatePrevious,
    [nextKey]: navigateNext
  })

  useEffect(() => {
    if (!listRef.current) return
    const element = getSelectedElement()
    if (!element) return
    if (element.tagName === 'INPUT') return

    // todo: cache the next line since it doesn't change
    const containerRect = listRef.current.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    if (rect.bottom > containerRect.bottom) {
      // scroll down
      listRef.current.scrollTop += (rect.bottom - containerRect.bottom)
    }
    if (rect.top < containerRect.top) {
      // scroll up
      listRef.current.scrollTop -= (containerRect.top - rect.top)
    }
  })

  return [current, setNavigation, getCurrent]
}
