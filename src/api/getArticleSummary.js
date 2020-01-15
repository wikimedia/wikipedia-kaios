import { cachedFetch } from 'utils'

export const getArticleSummary = (lang, title) => {
  const url = `https://${lang}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`
  return cachedFetch(url, data => ({
    title: data.displaytitle,
    imageUrl: data.thumbnail && data.thumbnail.source,
    preview: data.extract_html || data.description
  })
  )
}
