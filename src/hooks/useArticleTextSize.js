import { useState, useLayoutEffect } from 'preact/hooks'
import { useSoftkey } from 'hooks'
import { articleTextSize } from 'utils'

export const useArticleTextSize = (origin) => {
  const [textSize, setTextSize] = useState(articleTextSize.get())

  useSoftkey(origin, {
    ...articleTextSize.getSoftkeyEffect(setTextSize)
  }, [])

  useLayoutEffect(() => {
    articleTextSize.init()
  }, [])

  return [textSize]
}
