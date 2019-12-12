import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from 'contexts'

export const useSoftkey = (origin, config = null, dependencies = []) => {
  const softkey = useContext(SoftkeyContext)
  useEffect(() => {
    softkey.dispatch({ type: 'push', origin })
    return () => { softkey.dispatch({ type: 'pop', origin }) }
  }, [origin])

  useEffect(() => {
    if (config) {
      softkey.dispatch({ type: 'set', config })
    }
  }, dependencies)
  return softkey
}
