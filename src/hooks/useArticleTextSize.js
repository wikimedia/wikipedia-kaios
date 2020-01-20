import { useState, useLayoutEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'

export const useArticleTextSize = (origin, dependencies = []) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  useSoftkey(origin, {
    ...articleTextSize.getSoftkeyEffect(setTextSize)
  }, dependencies)

  useLayoutEffect(() => {
    articleTextSize.init()
  }, dependencies)

  return [textSize]
}
