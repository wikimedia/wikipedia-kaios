import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from 'api'

export const useArticleMediaInfo = (lang, title) => {
  const [media, setMedia] = useState()

  useEffect(() => {
    getArticleMediaInfo(lang, title)
      .then(media => setMedia(media))
  }, [])

  return media
}
