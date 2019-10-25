function getArticle (lang, title) {
  const url = 'https://' + lang + '.wikipedia.org/api/rest_v1/page/mobile-sections/' + title
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const parser = new DOMParser()
      var doc = parser.parseFromString(data.lead.sections[0].text, 'text/html')
      const paragraphs = Array.prototype.map.call(
        doc.querySelectorAll('p'), (n) => n.outerHTML)
      return {
        title: data.lead.displaytitle,
        description: data.lead.description,
        imageUrl: data.lead.image && data.lead.image.urls['320'],
        preview: paragraphs[0],
        paragraphs: paragraphs
      }
    })
}

function search (lang, term) {
  const url = 'https://' + lang + '.wikipedia.org/w/api.php?action=query&redirects=&converttitles=&prop=description|pageimages|info&piprop=thumbnail&pilicense=any&generator=prefixsearch&gpsnamespace=0&list=search&srnamespace=0&inprop=varianttitles&srwhat=text&srinfo=suggestion&srprop=&sroffset=0&srlimit=1&pithumbsize=64&gpslimit=10&origin=*&format=json&gpssearch=' + term + '&srsearch=' + term
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      return Object.values(data.query.pages).map((p) => {
        return {
          title: p.title,
          titleHtml: p.title.replace(term, '<span class="searchmatch">' + term + '</span>'),
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
