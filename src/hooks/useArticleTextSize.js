import { useState, useLayoutEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'

export const useArticleTextSize = (origin, dependencies = [], withSoftkeys = true) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  if (withSoftkeys) {
    useSoftkey(origin, {
      ...articleTextSize.getSoftkeyEffect(setTextSize)
    }, dependencies)
  }

  useLayoutEffect(() => {
    articleTextSize.init()
  }, dependencies)

  return [textSize]
}
