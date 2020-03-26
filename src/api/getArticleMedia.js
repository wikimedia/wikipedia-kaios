import { cachedFetch, buildPcsUrl, canonicalizeTitle } from 'utils'

export const getArticleMedia = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'media-list')
  return cachedFetch(url, data => data.items.reduce((mediaArray, item) => {
    if (item.showInGallery) {
      const media = {
        author: item.artist && item.artist.text,
        caption: item.caption && item.caption.text,
        description: item.description && item.description.text,
        license: item.license && item.license.type,
        filePage: item.file_page,
        thumbnail:
          (item.thumbnail && item.thumbnail.source) ||
          (item.srcset && item.srcset[0] && item.srcset[0].src),
        canonicalizedTitle:
        (item.titles && canonicalizeTitle(item.titles.normalized)) ||
        (item.title && canonicalizeTitle(item.title))
      }

      return mediaArray.concat(media)
    }
    return mediaArray
  }, [])
  )
}
