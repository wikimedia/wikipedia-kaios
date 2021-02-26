import { useState, useEffect } from 'preact/hooks'
import { useHistoryState } from 'hooks'
import { search } from 'api'

export const useSearch = (lang) => {
  const [query, setQuery] = useHistoryState('query', '')

  const [searchResults, setSearchResults] = useState()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (query && query.trim()) {
      setLoading(true)
      const [request, abort] = search(lang, query.trim())
      request.then(data => {
        setLoading(false)
        setSearchResults(data)
      })
      return abort
    } else {
      setLoading(false)
      setSearchResults(null)
    }
  }, [lang, query])

  return [query, setQuery, searchResults, loading]
}
