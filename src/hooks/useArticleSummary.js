import { useState, useEffect } from 'preact/hooks'
import { getArticleSummary } from 'api'

export const useArticleSummary = (lang, title) => {
  const [summary, setSummary] = useState()

  useEffect(() => {
    getArticleSummary(lang, title)
      .then(summary => setSummary(summary))
  }, [lang, title])

  return summary
}
