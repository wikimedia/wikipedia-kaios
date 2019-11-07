import { useState, useEffect } from 'preact/hooks'

export const useNavigation = (containerRef, axis, elementsSelector = '[data-selectable]') => {
  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)

    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  useEffect(() => {
    if (!containerRef.current) return
    const element = getSelectedElement()
    if (!element) return
    if (element.tagName === 'INPUT') return

    // todo: cache the next line since it doesn't change
    const containerRect = containerRef.current.getBoundingClientRect()
    const rect = element.getBoundingClientRect()
    if (rect.bottom > containerRect.bottom) {
      // scroll down
      containerRef.current.scrollTop += (rect.bottom - containerRect.bottom)
    }
    if (rect.top < containerRect.top) {
      // scroll up
      containerRef.current.scrollTop -= (containerRect.top - rect.top)
    }
  })

  const previousKey = axis === 'x' ? 'ArrowLeft' : 'ArrowUp'
  const nextKey = axis === 'x' ? 'ArrowRight' : 'ArrowDown'

  const [current, setCurrent] = useState({ type: null, index: null, key: null })

  const getAllElements = () => document.querySelectorAll(elementsSelector)

  const getSelectedElement = () => {
    return document.querySelector('[nav-selected=true]')
  }

  const getTheIndexOfTheSelectedElement = () => {
    const element = getSelectedElement()
    return element ? parseInt(element.getAttribute('nav-index')) : 0
  }

  const setNavigation = index => selectElement(getAllElements()[index] || document.body)

  const onKeyDown = evt => {
    if (evt.key !== previousKey && evt.key !== nextKey) return
    evt.preventDefault()
    const allElements = getAllElements()
    const currentIndex = getTheIndexOfTheSelectedElement()

    let setIndex
    switch (evt.key) {
      case nextKey:
        setIndex = (currentIndex + 1 > allElements.length - 1) ? 0 : currentIndex + 1
        return selectElement(allElements[setIndex] || allElements[0], setIndex)
      case previousKey:
        setIndex = (currentIndex === 0) ? allElements.length - 1 : currentIndex - 1
        return selectElement(allElements[setIndex] || allElements[0], setIndex)
      default:
        break
    }
  }

  const selectElement = (selectElement, setIndex = 0) => {
    if (selectElement) {
      [].forEach.call(getAllElements(), (element, index) => {
        const selectThisElement = element === selectElement
        element.setAttribute('nav-selected', selectThisElement)
        element.setAttribute('nav-index', index)
        if (element.nodeName === 'INPUT') {
          selectThisElement ? element.focus() : element.blur()
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
      index: element.getAttribute('nav-index'),
      key: element.getAttribute('data-selected-key')
    }
  }

  return [current, setNavigation, getCurrent]
}
