import { useState, useEffect } from 'preact/hooks'
import { getArticleMedia } from 'api'

export const useArticleMedia = (lang, title, fromCommon, currentIndex) => {
  const [media, setMedia] = useState()

  useEffect(() => {
    const [promise, abort] = getArticleMedia(lang, title, fromCommon)
    promise.then(setMedia)
    return abort
  }, [currentIndex])

  return media
}
