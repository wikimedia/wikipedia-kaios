import { useState, useLayoutEffect } from 'preact/hooks'
import { articleTextSize } from 'utils'

export const useArticleTextSize = (dependencies = []) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  useLayoutEffect(() => {
    articleTextSize.init()
  }, dependencies)

  return [textSize, setTextSize]
}
