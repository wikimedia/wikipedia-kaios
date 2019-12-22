import { useState, useEffect } from 'preact/hooks'
import { useSoftkey, usePopup, useI18n } from 'hooks'
import { viewport } from 'utils'
import { ArticlePreview } from 'components'

const SELECTED_ATTRIBUTE = 'data-selected'

const SUPPORTED_LINKS = [
  '[data-action]',
  'a[title]',
  '.mw-ref',
  'a[rel="mw:ExtLink"]'
].join(',')

export const useArticleLinksNavigation = (
  origin,
  lang,
  contentRef,
  currentPage,
  linkHandlers = {}
) => {
  const i18n = useI18n()
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLinkInternal] = useState(null)

  const [showArticlePreview] = usePopup(ArticlePreview, { position: 'bottom' })

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
    const visibleLinks = findVisibleLinks(contentRef.current)
    setLinks(visibleLinks)
    if (visibleLinks.length) {
      setCurrentLink(visibleLinks[0])
    } else {
      setCurrentLink(null)
    }
  }, [currentPage])

  const defaultLinkHandlers = {
    title: ({ title }) => {
      showArticlePreview({ title, lang })
    },
    external: ({ href }) => {
      window.open(href)
    }
  }

  const actualLinkHandlers = Object.assign({},
    defaultLinkHandlers, linkHandlers)

  useSoftkey(origin, {
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
    center: currentLink ? i18n.i18n('centerkey-select') : '',
    onKeyCenter: () => {
      if (!currentLink) {
        return
      }
      const clickEvent = makeLinkClickEvent(currentLink)
      const handler = actualLinkHandlers[clickEvent.type]
      if (handler) {
        handler(clickEvent)
      }
    }
  }, [links, currentLink])

  return [currentLink]
}

const makeLinkClickEvent = link => {
  const title = link.getAttribute('title')
  if (title) {
    return { type: 'title', title }
  }

  const action = link.getAttribute('data-action')
  if (action) {
    return { type: 'action', action }
  }

  if (link.classList.contains('mw-ref')) {
    const refLink = link.querySelector('a')
    const referenceId = refLink.getAttribute('href').slice(1)
    return { type: 'reference', referenceId }
  }

  if (link.getAttribute('rel') === 'mw:ExtLink') {
    return { type: 'external', href: link.href }
  }
}

const findVisibleLinks = container => {
  const links = container.querySelectorAll(SUPPORTED_LINKS)
  const visibleLinks = []
  let rect
  for (const link of links) {
    rect = link.getBoundingClientRect()
    if (!rect.height || !rect.width) {
      // Hidden (probably display:none;)
      continue
    }
    if (rect.x < 0 && (rect.x + rect.width < 0)) {
      // Not visible on this page at all
      continue
    }
    if (rect.x > viewport.width || rect.y > viewport.height) {
      // After the current page
      break
    }
    visibleLinks.push(link)
  }
  return visibleLinks
}
