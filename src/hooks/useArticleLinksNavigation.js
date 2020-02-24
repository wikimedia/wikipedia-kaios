import { useState, useEffect } from 'preact/hooks'
import { useSoftkey, usePopup, useI18n } from 'hooks'
import { viewport, INTERWIKI_KEYS, normalizeTitle } from 'utils'
import { ArticlePreview } from 'components'

const SELECTED_ATTRIBUTE = 'data-selected'

const SUPPORTED_LINKS = [
  '[data-action]',
  'a[title]',
  'a[href^="#cite_note"]',
  'a[rel="mw:ExtLink"]',
  'a[href^="#"]',
  'figure',
  'figure-inline'
].join(',')

export const useArticleLinksNavigation = (
  origin,
  lang,
  contentRef,
  linkHandlers = {},
  dependencies = [],
  showArticleMenu = null
) => {
  const i18n = useI18n()
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLinkInternal] = useState(null)

  const [showArticlePreview] = usePopup(ArticlePreview, { stack: true })

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
      if (visibleLinks.indexOf(currentLink) === -1) {
        setCurrentLink(visibleLinks[0])
      }
    } else {
      setCurrentLink(null)
    }
  }, dependencies)

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
    left: i18n.i18n('softkey-close'),
    onKeyLeft: () => history.back(),
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
    right: i18n.i18n('softkey-menu'),
    onKeyRight: showArticleMenu,
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
  if (title && link.pathname !== '/') {
    if (title.includes(':') && INTERWIKI_KEYS.includes(title.split(':')[0])) {
      return { type: 'external', href: link.href }
    }
    return { type: 'title', title }
  }

  const action = link.getAttribute('data-action')
  if (action) {
    return { type: 'action', action }
  }

  if (link.parentElement.classList.contains('mw-ref')) {
    const referenceId = link.getAttribute('href').slice(1)
    return { type: 'reference', referenceId }
  }

  if (link.getAttribute('rel') === 'mw:ExtLink') {
    return { type: 'external', href: link.href }
  }

  if (link.hash) {
    const normalizedText = normalizeTitle(link.hash.slice(1))
    return { type: 'section', text: normalizedText, anchor: link.getAttribute('href').slice(1) }
  }

  if (link.tagName === 'FIGURE' || link.tagName === 'FIGURE-INLINE') {
    const aElement = link.querySelector('a')
    const href = aElement.getAttribute('href')
    // file name example in href : /wiki/File:Holly_Christmas_card_from_NLI.jpg
    // slice(6) to match the api file name
    const fileName = href.slice(6)
    return { type: 'image', fileName }
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
    if (rect.y < 0 && (rect.y + rect.height < 0)) {
      continue
    }
    if (rect.x > viewport.width || rect.y > (viewport.height - 30)) {
      // After the current page
      break
    }
    visibleLinks.push(link)
  }
  return visibleLinks
}
