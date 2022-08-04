import {
  cachedFetch, buildPcsUrl, canonicalizeTitle
} from 'utils'

export const getArticle = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'mobile-html')

  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(data, 'text/html')
    const toc = []
    const sections = []
    const references = {}

    const getMeta = (prop, key = 'property') => {
      const metaNode = doc.querySelector('head > meta[' + key + '="' + prop + '"]')
      return metaNode && metaNode.getAttribute('content')
    }

    const lead = doc.querySelector('header')
    const section0 = doc.querySelector('section')
    const infoboxNode = section0.querySelector('.infobox')
    const infobox = infoboxNode && modifyHtmlText(infoboxNode.outerHTML, lang)
    const pcsTableContainer = section0.querySelector('.pcs-collapse-table-container')
    pcsTableContainer && pcsTableContainer.remove()
    const articleTitle = (lead && lead.querySelector('h1').textContent) || doc.title
    const articleDescription = lead && lead.querySelector('p') && lead.querySelector('p').textContent
    sections.push({
      imageUrl: getMeta('mw:leadImage'),
      title: articleTitle,
      anchor: canonicalizeTitle(articleTitle),
      description: articleDescription,
      content: modifyHtmlText(section0.outerHTML)
    })

    toc.push({
      level: 1,
      line: articleTitle,
      anchor: canonicalizeTitle(articleTitle),
      sectionIndex: 0
    })

    Array.from(doc.querySelectorAll('section')).forEach((section, index) => {
      if (index === 0) {
        return
      }
      const titleNode = section.querySelector('h1, h2, h3, h4, h5')
      const title = titleNode.textContent
      const anchor = titleNode.id || canonicalizeTitle(title)
      const level = parseInt(titleNode.tagName.charAt(1)) - 1
      const sectionHeader = section.querySelector('.pcs-edit-section-header')

      const content = '<div>' + modifyHtmlText(section.innerHTML) + '</div>'

      // new section when toclevel 1
      if (level === 1) {
        if (sectionHeader) {
          sectionHeader.remove()
        }
        sections.push({ title, anchor, content })
      }

      // build toc structure (level 1 to 3)
      level <= 3 && toc.push({
        level,
        line: title,
        anchor,
        sectionIndex: sections.length - 1
      })
    })

    // build references list
    const refNodes = doc.querySelectorAll('li[id^="cite_"]')
    for (const refNode of refNodes) {
      const [id, ref] = extractReference(refNode)
      references[id] = ref
    }

    const result = {
      contentLang: getMeta('content-language', 'http-equiv'),
      namespace: parseInt(getMeta('mw:pageNamespace'), 10),
      id: getMeta('mw:pageId'),
      sections,
      infobox,
      toc,
      references,
      dir: doc.querySelector('body').getAttribute('dir')
    }

    return result
  }, true, 'text')
}

const fixImageUrl = (htmlString, lang) => {
  // The app is served from the app:// protocol so protocol-relative
  // image sources don't work.
  return htmlString
    .replace(/\/\//gi, 'https://')
    .replace(/\/w\/extensions\//gi, `https://${lang}.wikipedia.org/w/extensions/`)
}

const modifyHtmlText = (text, lang) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  // enable section
  const sectionNodes = doc.querySelectorAll('section')
  for (const sectionNode of sectionNodes) {
    sectionNode.style.removeProperty('display')
  }

  // enable lazyload image
  const imageSpanNodes = doc.querySelectorAll('span.pcs-lazy-load-placeholder')
  for (const imageSpanNode of imageSpanNodes) {
    const source = imageSpanNode.getAttribute('data-src')
    const image = document.createElement('img')
    image.src = source
    image.height = imageSpanNode.getAttribute('data-height')
    imageSpanNode.parentNode.appendChild(image)

    if (!imageSpanNode.parentNode.classList.contains('image')) {
      imageSpanNode.parentNode.classList += ' image'
    }

    imageSpanNode.remove()
  }

  // fix image node
  const imageNodes = doc.querySelectorAll('img')
  for (const imageNode of imageNodes) {
    const url = fixImageUrl(imageNode.getAttribute('src'), lang)
    imageNode.setAttribute('src', url)
  }

  return doc.body.innerHTML
}

const extractReference = refNode => {
  const id = refNode.getAttribute('id')
  const [, number] = id.match(/.*?-(\d+)/)
  const refContentNode = refNode.querySelector('.mw-reference-text')
  const content = refContentNode ? refContentNode.outerHTML : ''
  return [id, { number, content }]
}
