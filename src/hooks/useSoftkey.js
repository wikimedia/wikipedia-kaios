import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from 'contexts'

export const useSoftkey = (origin, config = null, dependencies = [], replace = false) => {
  const softkey = useContext(SoftkeyContext)
  useEffect(() => {
    softkey.dispatch({ type: 'push', origin })
    return () => softkey.dispatch({ type: 'pop', origin })
  }, [origin])

  useEffect(() => {
    if (config) {
      const type = replace ? 'replace' : 'set'
      softkey.dispatch({ type, config })
    }
  }, dependencies)
  return softkey
}
