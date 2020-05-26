import { useState, useEffect } from 'preact/hooks'
import { useHistoryState } from 'hooks'
import { search } from 'api'

export const useSearch = (lang) => {
  const [query, setQuery] = useHistoryState('query', '')

  const [searchResults, setSearchResults] = useState()

  useEffect(() => {
    if (query) {
      const [request, abort] = search(lang, query)
      request.then(setSearchResults)
      return abort
    } else {
      setSearchResults(null)
    }
  }, [lang, query])

  return [query, setQuery, searchResults]
}
