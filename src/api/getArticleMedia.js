import { cachedFetch, buildPcsUrl } from 'utils'

export const getArticleMedia = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'media')
  return cachedFetch(url, data => data.items.reduce((mediaArray, item) => {
    if (item.showInGallery) {
      const media = {
        author: item.artist && item.artist.text,
        caption: item.caption && item.caption.text,
        description: item.description && item.description.text,
        license: item.license && item.license.type,
        filePage: item.file_page,
        thumbnail: item.thumbnail && item.thumbnail.source,
        canonicalizedTitle: item.titles && item.titles.canonical
      }

      return mediaArray.concat(media)
    }
    return mediaArray
  }, [])
  )
}
