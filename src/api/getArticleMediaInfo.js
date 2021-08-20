import { cachedFetch, buildMwApiUrl, viewport } from 'utils'

export const getArticleMediaInfo = (lang, title) => {
  const params = {
    action: 'query',
    prop: 'imageinfo',
    iiextmetadatafilter: 'License|LicenseShortName|ImageDescription|Artist',
    iiextmetadatalanguage: lang,
    iiextmetadatamultilang: 1,
    iiurlwidth: viewport().width,
    iiurlheight: viewport().height,
    iiprop: 'url|extmetadata',
    titles: title
  }

  const url = buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    const pages = data.query.pages
    const imageInfo = pages[0].imageinfo

    if (!imageInfo) {
      return {}
    }

    const { Artist, ImageDescription, LicenseShortName } = imageInfo[0].extmetadata
    const author = Artist && strip(Artist.value)
    const description = ImageDescription && strip(
      (typeof ImageDescription.value === 'string' && ImageDescription.value) ||
      (ImageDescription.value[lang] || ImageDescription.value[Object.keys(ImageDescription.value)[0]])
    )

    return {
      author,
      description,
      license: LicenseShortName && LicenseShortName.value,
      filePage: convertUrlToMobile(imageInfo[0].descriptionshorturl),
      source: imageInfo[0].thumburl
    }
  })
}

const convertUrlToMobile = url => {
  return url.replace(/https:\/\/(.*?)\./, subDomain => subDomain + 'm.')
}

const strip = html => {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  return doc.body.textContent || ''
}
