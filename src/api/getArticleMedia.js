import { cachedFetch, buildPcsUrl, canonicalizeTitle } from 'utils'

export const getArticleMedia = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'media-list')
  return cachedFetch(url, data => data.items.reduce((mediaArray, item) => {
    if (item.showInGallery && item.type === 'image') {
      const media = {
        // author: item.artist && item.artist.text,
        caption: item.caption && item.caption.text,
        // description: item.description && item.description.text,
        // license: item.license && item.license.type,
        // filePage: item.file_page,
        thumbnail: item && item.srcset && `https:${item.srcset[0].src}`,
        canonicalizedTitle:
          item.title && canonicalizeTitle(item.title.split(':')[1])
      }

      return mediaArray.concat(media)
    }
    return mediaArray
  }, [])
  )
}
