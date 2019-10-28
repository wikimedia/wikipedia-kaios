import { useState, useEffect, useRef } from 'preact/hooks'
import { search } from 'api/wiki'

export const useSearch = (lang) => {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const counter = useRef(0)

  useEffect(() => {
    if (query) {
      const requestId = ++counter.current
      search(lang, query)
        .then((results) => {
          // Need to use this trick because the target platform
          // doesn't have abortable fetch (AbortController).
          if (requestId === counter.current) {
            setSearchResults(results)
          }
        })
    } else {
      counter.current = 0
      setSearchResults(null)
    }
  }, [lang, query])

  return [searchResults, setQuery]
}
