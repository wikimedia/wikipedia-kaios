import { useState, useEffect } from 'preact/hooks'
import { useHistoryState } from 'hooks'
import { search } from 'api'

export const useSearch = (lang) => {
  const [query, setQuery] = useHistoryState('query', '')
  const [lastFeedIndex, setLastFeedIndex] = useHistoryState('lastFeedIndex', null)

  const [searchResults, setSearchResults] = useState()

  useEffect(() => {
    if (query && query.trim()) {
      const [request, abort] = search(lang, query)
      request.then(setSearchResults)
      return abort
    } else {
      setSearchResults(null)
    }
  }, [lang, query])

  return [query, setQuery, searchResults, lastFeedIndex, setLastFeedIndex]
}
