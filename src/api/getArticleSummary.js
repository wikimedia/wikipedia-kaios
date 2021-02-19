import { cachedFetch, buildPcsUrl } from 'utils'

export const getArticleSummary = (lang, title) => {
  const url = buildPcsUrl(lang, title, 'summary')
  return cachedFetch(url, data => ({
    titles: data.titles,
    imageUrl: data.thumbnail && data.thumbnail.source,
    preview: data.extract_html || data.description,
    namespace: data.namespace.id,
    id: data.pageid
  })
  )
}
