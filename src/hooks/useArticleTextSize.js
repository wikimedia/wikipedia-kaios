import { useEffect, useContext } from 'preact/hooks'
import { FontContext } from 'contexts'
import { articleTextSize } from 'utils'

export const useArticleTextSize = () => {
  const { fontSizeClass, setFontSizeClass } = useContext(FontContext)

  useEffect(() => {
    setFontSizeClass(articleTextSize.getFontSizeClassName())
  }, [fontSizeClass])

  return [fontSizeClass, setFontSizeClass]
}
