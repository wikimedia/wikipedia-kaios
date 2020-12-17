import { useState, useEffect } from 'preact/hooks'
import { articleTextSize } from 'utils'

let setArticleFontClass

export const useArticleTextSize = (origin) => {
  const [fontSizeClass, setFontSizeClass] = useState(articleTextSize.getFontSizeClassName())

  if (origin === 'Article') {
    setArticleFontClass = setFontSizeClass
  }

  useEffect(() => {
    setArticleFontClass(articleTextSize.getFontSizeClassName())
  })

  return [fontSizeClass, setFontSizeClass]
}
