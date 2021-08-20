import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from 'api'

export const useArticleMediaInfo = (lang, title, currentIndex) => {
  const [media, setMedia] = useState()

  useEffect(() => {
    const [promise, abort] = getArticleMediaInfo(lang, title)
    promise.then(setMedia)
    return abort
  }, [currentIndex])

  return media
}
