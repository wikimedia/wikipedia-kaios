import { useState, useEffect } from 'preact/hooks'
import { useSoftkey, usePopup, useI18n } from 'hooks'
import { viewport, INTERWIKI_KEYS, normalizeTitle, getDirection } from 'utils'
import { ArticlePreview } from 'components'

const SELECTED_ATTRIBUTE = 'data-selected'

const SUPPORTED_LINKS = [
  '[data-action]',
  'a[title]',
  'a[href^="#cite_note"]',
  'a[rel="mw:ExtLink"]',
  'a[href^="#"]',
  'figure',
  'figure-inline',
  'table:not([class^="infobox"])'
].join(',')

export const useArticleLinksNavigation = (
  origin,
  lang,
  contentRef,
  linkHandlers = {},
  dependencies = [],
  galleryItems = []
) => {
  const i18n = useI18n()
  const [links, setLinks] = useState([])
  const [currentLink, setCurrentLinkInternal] = useState(null)

  const [showArticlePreview] = usePopup(ArticlePreview, { stack: true })
  const dir = getDirection(lang)

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
    const visibleLinks = findVisibleLinks(contentRef.current, galleryItems)
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
      showArticlePreview({ title, lang, dir })
    },
    external: ({ href }) => {
      window.open(href)
    }
  }

  const actualLinkHandlers = Object.assign({},
    defaultLinkHandlers, linkHandlers)

  useSoftkey(origin, {
    [dir === 'rtl' ? 'onKeyArrowRight' : 'onKeyArrowLeft']: () => {
      if (!hasLinks()) {
        return
      }
      let i = links.indexOf(currentLink) - 1
      if (i < 0) {
        i = links.length - 1
      }
      setCurrentLink(links[i])
    },
    [dir === 'rtl' ? 'onKeyArrowLeft' : 'onKeyArrowRight']: () => {
      if (!hasLinks()) {
        return
      }
      const i = (links.indexOf(currentLink) + 1) % links.length
      setCurrentLink(links[i])
    },
    center: currentLink ? i18n('centerkey-select') : '',
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
  if (title && !['/', '/index.html'].includes(link.pathname)) {
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
    const fileName = getFileNameFromAnchorElement(aElement)
    return { type: 'image', fileName }
  }

  if (link.tagName === 'TABLE') {
    return { type: 'table', content: link.innerHTML }
  }
}

const findVisibleLinks = (container, galleryItems) => {
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
    if ((link.tagName === 'FIGURE' || link.tagName === 'FIGURE-INLINE') && !isImageInGallery(galleryItems, link)) {
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

const isImageInGallery = (galleryItems, link) => {
  const aElement = link.querySelector('a')
  if (!aElement) {
    return false
  }

  const fileName = getFileNameFromAnchorElement(aElement)
  return galleryItems.find(media => media.canonicalizedTitle === fileName)
}

const getFileNameFromAnchorElement = (aElement) => {
  // file name example in href : /wiki/File:Holly_Christmas_card_from_NLI.jpg
  // split to match the api file name
  const href = aElement.getAttribute('href')
  return href.split(':')[1]
}
