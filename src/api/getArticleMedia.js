import { cachedFetch, buildPcsUrl } from 'utils'

export const getArticleMedia = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'media')
  return cachedFetch(url, data => data.items.map(item => ({
    author: item.artist && item.artist.text,
    description: item.description && item.description.text,
    license: item.license && item.license.type,
    filePage: item.file_page,
    thumbnail: item.thumbnail && item.thumbnail.source
  })
  ))
}
