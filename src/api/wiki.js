// todo: Implement a real cache that keeps
// the last N articles to keep memory usage
// under control.
const articleCache = {}

function getArticle (lang, title) {
  const cacheKey = lang + ':' + title
  if (articleCache[cacheKey]) {
    return Promise.resolve(articleCache[cacheKey])
  }
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const parser = new DOMParser()
      let content = data.lead.sections[0].text
      const doc = parser.parseFromString(data.lead.sections[0].text, 'text/html')
      const infoboxNode = doc.querySelector('[class^="infobox"]')
      const infobox = infoboxNode && infoboxNode.outerHTML

      data.remaining.sections.forEach((s) => {
        const header = 'h' + (s.toclevel + 1)
        const headerLine = `<${header}>${s.line}</${header}>`
        content += headerLine
        content += s.text
      })

      // The app is served from the app:// protocol so protocol-relative
      // image sources don't work.
      content = content.replace(/src="\/\//gi, 'src="https://')

      const result = {
        title: data.lead.displaytitle,
        description: data.lead.description,
        imageUrl: data.lead.image && data.lead.image.urls['320'],
        content,
        infobox
      }
      articleCache[cacheKey] = result
      return result
    })
}

function search (lang, term) {
  const baseUrl = `https://${lang}.wikipedia.org/w/api.php`
  const params = {
    action: 'query',
    redirects: null,
    converttitles: null,
    prop: ['description', 'pageimages', 'info'].join('|'),
    piprop: 'thumbnail',
    pilicense: 'any',
    generator: 'prefixsearch',
    gpsnamespace: 0,
    list: 'search',
    srnamespace: 0,
    inprop: 'varianttitles',
    srwhat: 'text',
    srinfo: 'suggestion',
    srprop: null,
    sroffset: 0,
    srlimit: 1,
    pithumbsize: 64,
    gpslimit: 10,
    origin: '*',
    format: 'json',
    gpssearch: term,
    srsearch: term
  }
  const url = baseUrl + '?' + Object.keys(params).map(p => `${p}=${params[p]}`).join('&')
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (!data.query.pages) {
        return []
      }
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
