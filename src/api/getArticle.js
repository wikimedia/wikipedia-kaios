import { cachedFetch } from 'utils'

export const getArticle = (lang, title) => {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`
  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const imageUrl = data.lead.image && data.lead.image.urls['320']
    const toc = []

    // parse info box
    const doc = parser.parseFromString(data.lead.sections[0].text, 'text/html')
    const infoboxNode = doc.querySelector('[class^="infobox"]')
    const infobox = infoboxNode && fixImageUrl(infoboxNode.outerHTML)

    // parse lead as the first section
    const sections = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      description: data.lead.description,
      content: fixImageUrl(data.lead.sections[0].text)
    })

    // parse section as the remaining section
    data.remaining.sections.forEach((s) => {
      // new section when toclevel 1
      if (s.toclevel === 1) {
        const imgFound = searchForFirstImage(s.text)
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
          const imageFound = searchForFirstImage(s.text)
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
    })

    return {
      sections,
      infobox,
      toc
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

const searchForFirstImage = content => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(content, 'text/html')
  for (const imgNode of doc.querySelectorAll('img')) {
    if (imgNode.getAttribute('width') >= 200) {
      return 'https:' + imgNode.getAttribute('src')
    }
  }
  return false
}
