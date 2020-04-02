import { useState, useEffect } from 'preact/hooks'
import { getArticleMediaInfo } from 'api'

export const useArticleMediaInfo = (lang, title, fromCommon) => {
  const [media, setMedia] = useState()

  useEffect(() => {
    getArticleMediaInfo(lang, title, fromCommon)
      .then(media => setMedia(media))
  }, [])

  return media
}
