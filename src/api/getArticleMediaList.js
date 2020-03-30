import { cachedFetch, buildPcsUrl, canonicalizeTitle } from 'utils'

export const getArticleMediaList = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'media-list')
  return cachedFetch(url, data => data.items.reduce((mediaArray, item) => {
    if (item.showInGallery && item.type === 'image') {
      const media = {
        caption: item.caption && item.caption.text,
        thumbnail: item && item.srcset && `https:${item.srcset[0].src}`,
        title: item.title,
        canonicalizedTitle:
          item.title && canonicalizeTitle(item.title.split(':')[1])
      }

      return mediaArray.concat(media)
    }
    return mediaArray
  }, [])
  )
}
