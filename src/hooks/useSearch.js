import { useState, useEffect } from 'preact/hooks'
import { search } from 'api'

export const useSearch = (lang, initialQuery) => {
  const [query, setQuery] = useState(initialQuery)

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

  return [setQuery, searchResults, loading]
}
