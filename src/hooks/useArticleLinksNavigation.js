import { useState, useEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'
import { viewport } from 'utils'

const SELECTED_ATTRIBUTE = 'data-selected'

export const useArticleLinksNavigation = (
  contentRef,
  currentPage,
  onTitleClick,
  onActionClick
) => {
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLinkInternal] = useState(null)

  const setCurrentLink = newLink => {
    setCurrentLinkInternal(previousLink => {
      if (previousLink) {
        previousLink.removeAttribute(SELECTED_ATTRIBUTE)
      }
      if (newLink) {
        newLink.setAttribute(SELECTED_ATTRIBUTE, true)
      }
      return newLink
    })
  }

  const hasLinks = () => links && links.length

  useEffect(() => {
    const links = contentRef.current.querySelectorAll('[data-action], a[title]')
    const visibleLinks = []
    let rect
    for (const link of links) {
      rect = link.getBoundingClientRect()
      if (!rect.height || !rect.width || rect.x < 0) {
        // Not visible or before the current page
        continue
      }
      if (rect.x > viewport.width) {
        // After the current page
        break
      }
      visibleLinks.push(link)
    }
    setLinks(visibleLinks)
    if (visibleLinks.length) {
      setCurrentLink(visibleLinks[0])
    } else {
      setCurrentLink(null)
    }
  }, [currentPage])

  useSoftkey('Article', {
    onKeyArrowLeft: () => {
      if (!hasLinks()) {
        return
      }
      let i = links.indexOf(currentLink) - 1
      if (i < 0) {
        i = links.length - 1
      }
      setCurrentLink(links[i])
    },
    onKeyArrowRight: () => {
      if (!hasLinks()) {
        return
      }
      const i = (links.indexOf(currentLink) + 1) % links.length
      setCurrentLink(links[i])
    },
    onKeyCenter: () => {
      if (currentLink) {
        const title = currentLink.getAttribute('title')
        if (title) {
          onTitleClick(title)
          return
        }
        const action = currentLink.getAttribute('data-action')
        if (action) {
          onActionClick(action)
        }
      }
    }
  }, [links, currentLink])

  return [currentLink]
}
