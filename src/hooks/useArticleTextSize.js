import { useState, useEffect } from 'preact/hooks'
import { articleTextSize } from 'utils'

let setArticleTextSize

export const useArticleTextSize = (origin) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  if (origin === 'Article') {
    setArticleTextSize = setTextSize
  }

  useEffect(() => {
    setArticleTextSize(articleTextSize.get())
  })

  return [textSize, setTextSize]
}
