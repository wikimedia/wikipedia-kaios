import { cachedFetch, buildPcsUrl, canonicalizeTitle, getDirection } from 'utils'

export const getArticle = (lang, title, { moreInformationText }) => {
  const url = buildPcsUrl(lang, title, 'mobile-sections')
  const dir = getDirection(lang)

  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(data.lead.sections[0].text, 'text/html')
    const imageUrl = data.lead.image && data.lead.image.urls['320']
    const toc = []
    const references = {}
    const languageCount = data.lead.languagecount

    fixImageUrl(doc, lang)
    fixTableCaption(doc, moreInformationText)
    const infobox = extractInfobox(doc)

    // parse lead as the first section
    const sections = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      description: data.lead.description,
      content: doc.body.innerHTML
    })
    toc.push({
      level: 1,
      line: data.lead.normalizedtitle,
      anchor: canonicalizeTitle(data.lead.normalizedtitle),
      sectionIndex: 0
    })

    // parse remaining sections
    data.remaining.sections.forEach((s) => {
      const sectionDoc = parser.parseFromString(s.text, 'text/html')
      fixImageUrl(sectionDoc, lang)
      fixTableCaption(sectionDoc, moreInformationText)
      const modifiedTextContent = sectionDoc.body.innerHTML
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
      id: data.lead.id,
      sections,
      infobox,
      toc,
      references,
      languageCount,
      dir
    }
  })
}

const fixImageUrl = (doc, lang) => {
  Array.from(doc.querySelectorAll('img')).forEach(img => {
    img.src = 'https:' + img.getAttribute('src')
      .replace(/src="\/w\/extensions\//gi, `src="//${lang}.wikipedia.org/w/extensions/`)
      // .replace(/220px-/gi, '80px-')
    img.srcset = ''
  })
}

const fixTableCaption = (doc, moreInformationText) => {
  const hiddenClassName = 'hidden-in-table'
  const tableNodes = doc.querySelectorAll('table:not([class^="infobox"])')
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

const extractInfobox = doc => {
  const infoboxNode = doc.querySelector('[class^="infobox"]')
  if (infoboxNode) {
    // Clear a bunch of style that interfere with the layout
    infoboxNode.style.width = ''
    infoboxNode.style.fontSize = ''
    const disallowedProps = ['minWidth', 'whiteSpace', 'width']
    Array.from(infoboxNode.querySelectorAll('[style]')).forEach(n => {
      disallowedProps.forEach(propName => {
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

    // remove infobox from the doc to reduce DOM size
    infoboxNode.parentNode.removeChild(infoboxNode)

    return infoboxNode.outerHTML
  }
}
