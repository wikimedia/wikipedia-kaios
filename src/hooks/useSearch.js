import { useState, useEffect } from 'preact/hooks'
import { useHistoryState } from 'hooks'
import { search } from 'api'

export const useSearch = (lang) => {
  const [query, setQuery] = useHistoryState('query', '')

  const [searchResults, setSearchResults] = useState()

  useEffect(() => {
    if (query) {
      search(lang, query)
        .then(results => {
          setSearchResults(results)
        })
    } else {
      setSearchResults(null)
    }
  }, [lang, query])

  return [query, setQuery, searchResults]
}
