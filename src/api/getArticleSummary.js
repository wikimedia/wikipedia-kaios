import { cachedFetch, buildPcsUrl } from 'utils'

export const getArticleSummary = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'summary')
  return cachedFetch(url, data => ({
    title: data.displaytitle,
    imageUrl: data.thumbnail && data.thumbnail.source,
    preview: data.extract_html || data.description
  })
  )
}
