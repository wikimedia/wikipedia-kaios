import { cachedFetch, buildPcsUrl } from 'utils'

export const getArticle = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'mobile-sections')
  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const imageUrl = data.lead.image && data.lead.image.urls['320']
    const toc = []
    const references = {}
    const languageCount = data.lead.languagecount

    // parse info box
    const doc = parser.parseFromString(fixImageUrl(data.lead.sections[0].text), 'text/html')
    const infobox = extractInfobox(doc)
    const preview = extractPreview(doc)

    // parse lead as the first section
    const sections = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      description: data.lead.description,
      content: fixImageUrl(data.lead.sections[0].text),
      preview
    })
    toc.push({
      level: 1,
      line: data.lead.displaytitle,
      sectionIndex: 0
    })

    // parse remaining sections
    data.remaining.sections.forEach((s) => {
      const sectionDoc = parser.parseFromString(s.text, 'text/html')
      // new section when toclevel 1
      if (s.toclevel === 1) {
        const imgFound = searchForFirstImage(sectionDoc)
        sections.push({
          title: s.line,
          content: fixImageUrl(s.text),
          imageUrl: imgFound || imageUrl
        })
      } else {
        // group into previous section when toclevel > 1
        const previousSection = sections[sections.length - 1]
        const header = 'h' + (s.toclevel + 1)
        const headerLine = `<${header}>${s.line}</${header}>`
        previousSection.content += fixImageUrl(headerLine + s.text)

        if (previousSection.imageUrl === imageUrl) {
          const imageFound = searchForFirstImage(sectionDoc)
          if (imageFound) {
            previousSection.imageUrl = imageFound
          }
        }
      }

      // build toc structure (level 1 to 3)
      s.toclevel <= 3 && toc.push({
        level: s.toclevel,
        line: convertPlainText(s.line),
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
      sections,
      infobox,
      toc,
      references,
      languageCount
    }
  })
}

const fixImageUrl = (htmlString) => {
  // The app is served from the app:// protocol so protocol-relative
  // image sources don't work.
  return htmlString.replace(/src="\/\//gi, 'src="https://')
}

const convertPlainText = string => {
  var dom = document.createElement('div')
  dom.innerHTML = string
  return dom.textContent
}

const searchForFirstImage = doc => {
  for (const imgNode of doc.querySelectorAll('img')) {
    if (imgNode.getAttribute('width') >= 200) {
      return 'https:' + imgNode.getAttribute('src')
    }
  }
  return false
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
    infoboxNode.style.width = ''
    return infoboxNode.outerHTML
  }
}
