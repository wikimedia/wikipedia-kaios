import { useState, useEffect } from 'preact/hooks'
import { articleTextSize } from 'utils'

export const useArticleTextSize = (dependencies = []) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  useEffect(() => {
    console.log('useArticleTextSize - useEffect')
    articleTextSize.init()
  }, dependencies)

  return [textSize, setTextSize]
}
