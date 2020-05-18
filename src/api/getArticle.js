import { cachedFetch, buildPcsUrl, canonicalizeTitle } from 'utils'

export const getArticle = (lang, title, { moreInformationText }) => {
  const url = buildPcsUrl(lang, title, 'mobile-sections')

  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const imageUrl = data.lead.image && data.lead.image.urls['320']
    const toc = []
    const references = {}
    const languageCount = data.lead.languagecount

    // parse info box
    const doc = parser.parseFromString(fixImageUrl(data.lead.sections[0].text, lang), 'text/html')
    const infobox = extractInfobox(doc)
    const preview = extractPreview(doc)

    // parse lead as the first section
    const sections = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      description: data.lead.description,
      content: modifyHtmlText(data.lead.sections[0].text, moreInformationText, lang),
      preview
    })
    toc.push({
      level: 1,
      line: data.lead.normalizedtitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      sectionIndex: 0
    })

    // parse remaining sections
    data.remaining.sections.forEach((s) => {
      const modifiedTextContent = modifyHtmlText(s.text, moreInformationText, lang)
      // new section when toclevel 1
      if (s.toclevel === 1) {
        sections.push({
          title: s.line,
          anchor: s.anchor,
          content: modifiedTextContent
        })
      } else {
        // group into previous section when toclevel > 1
        const previousSection = sections[sections.length - 1]
        const header = 'h' + (s.toclevel + 1)
        const headerLine = `<${header} data-anchor=${s.anchor}>${s.line}</${header}>`
        previousSection.content += headerLine + modifiedTextContent
      }

      // build toc structure (level 1 to 3)
      s.toclevel <= 3 && toc.push({
        level: s.toclevel,
        line: convertPlainText(s.line),
        anchor: s.anchor,
        sectionIndex: sections.length - 1
      })

      // build references list
      if (s.isReferenceSection) {
        const sectionDoc = parser.parseFromString(s.text, 'text/html')
        const refNodes = sectionDoc.querySelectorAll('li[id^="cite_"]')
        for (const refNode of refNodes) {
          const [id, ref] = extractReference(refNode)
          references[id] = ref
        }
      }
    })

    return {
      contentLang: lang,
      namespace: data.lead.ns,
      sections,
      infobox,
      toc,
      references,
      languageCount
    }
  })
}

const fixImageUrl = (htmlString, lang) => {
  // The app is served from the app:// protocol so protocol-relative
  // image sources don't work.
  return htmlString
    .replace(/src="\/\//gi, 'src="https://')
    .replace(/src="\/w\/extensions\//gi, `src="https://${lang}.wikipedia.org/w/extensions/`)
}

const fixTableCaption = (htmlString, moreInformationText) => {
  const hiddenClassName = 'hidden-in-table'
  const parser = new DOMParser()
  const node = parser.parseFromString(htmlString, 'text/html')
  const tableNodes = node.querySelectorAll('table')
  for (const tableNode of tableNodes) {
    const thContent = Array.from(tableNode.querySelectorAll('th')).map(th => th.textContent).join(', ')
    const normalizedThContent = thContent.replace(/\[\d+]/g, '')
    if (tableNode.caption && tableNode.caption.textContent) {
      tableNode.caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p><span>${tableNode.caption.textContent}</span>`
    } else {
      const caption = tableNode.createCaption()
      caption.className = hiddenClassName
      caption.innerHTML = `<b class='${hiddenClassName}'>${moreInformationText}:</b><p class='${hiddenClassName}'>${normalizedThContent}</p>Table`
    }
    tableNode.style = ''
  }

  return node.childNodes[0].innerHTML
}

const modifyHtmlText = (text, moreInformationText, lang) => {
  const fixedImageUrlText = fixImageUrl(text, lang)
  return fixTableCaption(fixedImageUrlText, moreInformationText)
}

const convertPlainText = string => {
  var dom = document.createElement('div')
  dom.innerHTML = string
  return dom.textContent
}

const extractReference = refNode => {
  const id = refNode.getAttribute('id')
  const [, number] = id.match(/.*?-(\d+)/)
  const refContentNode = refNode.querySelector('.mw-reference-text')
  const content = refContentNode ? refContentNode.outerHTML : ''
  return [id, { number, content }]
}

const extractPreview = doc => {
  const p = doc.querySelector('p')

  if (!p) {
    return ''
  }

  Array.from(p.querySelectorAll('a')).forEach(link => {
    const span = document.createElement('span')
    span.textContent = link.textContent
    link.parentNode.replaceChild(span, link)
  })

  Array.from(p.querySelectorAll('.mw-ref')).forEach(ref => {
    ref.parentNode.removeChild(ref)
  })

  return p.outerHTML
}

const extractInfobox = doc => {
  const infoboxNode = doc.querySelector('[class^="infobox"]')
  if (infoboxNode) {
    // Clear a bunch of style that interfere with the layout
    infoboxNode.style.width = ''
    infoboxNode.style.fontSize = ''
    const blackListedProps = ['minWidth', 'whiteSpace', 'width']
    Array.from(infoboxNode.querySelectorAll('[style]')).forEach(n => {
      blackListedProps.forEach(propName => {
        if (n.style[propName]) {
          n.style[propName] = ''
        }
      })
    })

    // Long URLs in content make the table too wide
    Array.from(infoboxNode.querySelectorAll('a[href]')).forEach(a => {
      if (a.href === a.textContent) {
        // Use a shorter text (strip protocol and path)
        var u = new URL(a.href)
        a.textContent = u.hostname

        // Constrain the parent node and truncate if needed
        a.parentNode.classList.add('truncate')
      }
    })

    return infoboxNode.outerHTML
  }
}
