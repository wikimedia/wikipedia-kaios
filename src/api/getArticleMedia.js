import { cachedFetch, buildMwApiUrl, buildCommonsApiUrl, viewport } from 'utils'

export const getArticleMedia = (lang, title, fromCommon) => {
  const params = {
    action: 'query',
    prop: 'imageinfo',
    iiextmetadatalanguage: lang,
    iiextmetadatamultilang: 1,
    iiurlwidth: viewport().width,
    iiurlheight: viewport().height,
    iiprop: 'url|extmetadata',
    titles: title
  }

  const url = fromCommon ? buildCommonsApiUrl(params) : buildMwApiUrl(lang, params)
  return cachedFetch(url, data => {
    const pages = data.query.pages
    const imageInfo = pages[0].imageinfo

    if (!imageInfo) {
      return {}
    }

    return {
      source: imageInfo[0].thumburl
    }
  })
}
