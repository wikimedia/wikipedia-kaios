// todo: Implement a real cache that keeps
// the last N requests to keep memory usage
// under control.
const requestCache = {}
const cachedFetch = (url, transformFn) => {
  if (requestCache[url]) {
    return Promise.resolve(requestCache[url])
  }
  return fetch(url)
    .then(response => response.json())
    .then(data => transformFn(data))
    .then(data => {
      requestCache[url] = data
      return data
    })
}

const getArticle = (lang, title) => {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`
  return cachedFetch(url, data => {
    const parser = new DOMParser()
    const imageUrl = data.lead.image && data.lead.image.urls['320']

    // parse info box
    const doc = parser.parseFromString(data.lead.sections[0].text, 'text/html')
    const infoboxNode = doc.querySelector('[class^="infobox"]')
    const infobox = infoboxNode && infoboxNode.outerHTML

    // parse lead as the first section
    const sections = []
    sections.push({
      imageUrl,
      title: data.lead.displaytitle,
      description: data.lead.description,
      content: data.lead.sections[0].text
    })

    // parse section as the remaining section
    let nextTitle = ''
    let nextContent = ''
    data.remaining.sections.forEach((s) => {
      // the section starts with every toclevel 1
      if (s.toclevel === 1 && nextTitle) {
        // search for the first image in the content
        const doc = parser.parseFromString(nextContent, 'text/html')
        const imgNode = doc.querySelector('img')

        sections.push({
          title: nextTitle,
          content: nextContent,
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

      // The app is served from the app:// protocol so protocol-relative
      // image sources don't work.
      nextContent += s.text.replace(/src="\/\//gi, 'src="https://')
    })

    return {
      sections,
      infobox
    }
  })
}

const search = (lang, term) => {
  const baseUrl = `https://${lang}.wikipedia.org/w/api.php`
  const params = {
    action: 'query',
    format: 'json',
    formatversion: 2,
    origin: '*',
    prop: ['description', 'pageimages', 'pageprops'].join('|'),
    piprop: 'thumbnail',
    pilimit: 15,
    ppprop: 'displaytitle',
    generator: 'prefixsearch',
    pithumbsize: 64,
    gpslimit: 15,
    gpsnamespace: 0,
    gpssearch: term
  }
  const url = baseUrl + '?' + Object.keys(params).map(p => `${p}=${params[p]}`).join('&')
  return cachedFetch(url, data => {
    if (!data.query || !data.query.pages) {
      return []
    }
    data.query.pages.sort((a, b) => a.index - b.index)
    return Object.values(data.query.pages).map((p) => {
      return {
        title: p.title,
        titleHtml: p.title.replace(term, `<span class="searchmatch">${term}</span>`),
        description: p.description,
        imageUrl: p.thumbnail && p.thumbnail.source
      }
    })
  })
}

export {
  getArticle,
  search
}
