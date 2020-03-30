import { cachedFetch, buildMwApiUrl } from 'utils'

export const getArticleMediaInfo = (lang, title) => {
  const params = {
    action: 'query',
    prop: 'imageinfo',
    iiextmetadatafilter: 'License|LicenseShortName|ImageDescription|Artist',
    iiextmetadatalanguage: lang,
    iiextmetadatamultilang: 1,
    iiprop: 'url|extmetadata',
    titles: title
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    const pages = data.query.pages
    const imageInfo = pages[0].imageinfo[0]
    const { Artist, ImageDescription, LicenseShortName } = imageInfo.extmetadata
    const author = Artist && strip(Artist.value)
    const description = ImageDescription && strip(
      (typeof ImageDescription.value === 'string' && ImageDescription.value) ||
      (ImageDescription.value[lang] || ImageDescription.value[Object.keys(ImageDescription.value)[0]])
    )
    return {
      author,
      description,
      license: LicenseShortName && LicenseShortName.value,
      filePage: imageInfo.descriptionshorturl
    }
  })
}

function strip (html) {
  var doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}
