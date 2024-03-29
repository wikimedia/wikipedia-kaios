import { useState, useEffect } from 'preact/hooks'
import { useSoftkey, usePopup, useI18n } from 'hooks'
import { ArticlePreview } from 'components'
import {
  viewport, INTERWIKI_KEYS, normalizeTitle, getDirection,
  openExternal
} from 'utils'

const SELECTED_ATTRIBUTE = 'data-selected'

const SUPPORTED_LINKS = [
  '[data-action]',
  'a[title]',
  'a.reference-link',
  'a[rel="mw:ExtLink"]',
  'a[href^="#"]',
  'figure',
  'figure-inline',
  'div.tsingle',
  'a.image',
  '.gallerybox',
  '.pcs-collapse-table-container'
].join(',')

export const useArticleLinksNavigation = (
  origin,
  lang,
  contentRef,
  linkHandlers = {},
  dependencies = [],
  source = {}
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
    const visibleLinks = findVisibleLinks(contentRef.current, source.galleryItems)
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
      showArticlePreview({ title, lang, dir, source })
    },
    external: ({ href }) => {
      openExternal(href)
    }
  }

  const actualLinkHandlers = Object.assign({},
    defaultLinkHandlers, linkHandlers)

  useSoftkey(origin, {
    [dir === 'rtl' ? 'onKeyFixedArrowRight' : 'onKeyFixedArrowLeft']: () => {
      if (!hasLinks()) {
        return
      }
      let i = links.indexOf(currentLink) - 1
      if (i < 0) {
        i = links.length - 1
      }
      setCurrentLink(links[i])
    },
    [dir === 'rtl' ? 'onKeyFixedArrowLeft' : 'onKeyFixedArrowRight']: () => {
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
    if (link.hash) {
      const anchor = link.hash.split('#')[1]
      return { type: 'section', text: normalizeTitle(anchor), anchor }
    }
    return { type: 'title', title }
  }

  const action = link.getAttribute('data-action')
  if (action) {
    return { type: 'action', action }
  }

  if (link.classList.contains('reference-link')) {
    const referenceId = link.getAttribute('href').split('#')[1]
    return { type: 'reference', referenceId }
  }

  if (link.getAttribute('rel') === 'mw:ExtLink') {
    return { type: 'external', href: link.href }
  }

  if (link.hash) {
    const normalizedText = normalizeTitle(link.hash.slice(1))
    return { type: 'section', text: normalizedText, anchor: link.getAttribute('href').slice(1) }
  }

  if (isImageLink(link)) {
    const fileName = getFileNameFromAnchorElement(link)
    return { type: 'image', fileName }
  }

  if (isTableLink(link)) {
    return { type: 'table', content: link.querySelector('.pcs-collapse-table-content').innerHTML }
  }
}

const findVisibleLinks = (container, galleryItems) => {
  const links = container.querySelectorAll(SUPPORTED_LINKS)
  const visibleLinks = []
  let prevImage
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
    if (isImageLink(link)) {
      const fileName = getFileNameFromAnchorElement(link)
      if (fileName && isImageInGallery(galleryItems, fileName)) {
        // use to capture a.image without figure/figure-inline tag
        // and prevent the duplicate case of a.image exist under figure/figure-inline
        if (prevImage === fileName) {
          continue
        } else {
          prevImage = fileName
        }
      } else {
        continue
      }
    }
    if (rect.x > viewport().width || rect.y > (viewport().height - 30)) {
      // After the current page
      break
    }
    visibleLinks.push(link)
  }
  return visibleLinks
}

const isImageLink = link => {
  return ['FIGURE', 'FIGURE-INLINE'].includes(link.tagName) ||
    Array.from(link.classList).some(classname => ['tsingle', 'image', 'gallerybox'].includes(classname))
}

const isTableLink = link => {
  return link.classList.contains('pcs-collapse-table-container')
}

const isImageInGallery = (galleryItems = [], fileName) => {
  if (!galleryItems) {
    return false
  }
  return galleryItems.find(media => media.canonicalizedTitle === fileName)
}

const getFileNameFromAnchorElement = link => {
  const aElement = link.querySelector('a') || (link.tagName === 'A' && link)

  if (!aElement) {
    return
  }

  // file name example in href : /wiki/File:Holly_Christmas_card_from_NLI.jpg
  // split to match the api file name
  const href = aElement.getAttribute('href')
  return href && href.split(':')[1]
}
