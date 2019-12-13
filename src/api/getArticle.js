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
    let nextTitle = ''
    let nextContent = ''
    data.remaining.sections.forEach((s) => {
      // the section starts with every toclevel 1
      if (s.toclevel === 1 && nextTitle) {
        const modifiedContent = fixImageUrl(nextContent)

        // search for the first image in the content
        const doc = parser.parseFromString(modifiedContent, 'text/html')
        const imgNode = doc.querySelector('img')

        sections.push({
          title: nextTitle,
          content: modifiedContent,
          imageUrl: (imgNode && imgNode.getAttribute('src')) || imageUrl
        })

        nextTitle = ''
        nextContent = ''
      }

      if (s.toclevel === 1) {
        nextTitle = s.line
      }

      const header = 'h' + (s.toclevel + 1)
      const headerLine = `<${header}>${s.line}</${header}>`

      // add header when it is not h1
      nextContent += s.toclevel !== 1 ? headerLine : ''

      nextContent += s.text

      // build toc structure (level 1 to 3)
      s.toclevel <= 3 && toc.push({
        level: s.toclevel,
        line: convertPlainText(s.line),
        sectionIndex: sections.length
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
