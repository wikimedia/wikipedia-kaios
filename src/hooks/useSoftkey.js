import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from 'contexts'

export const useSoftkey = (origin, option, dependencies = []) => {
  const softkey = useContext(SoftkeyContext)
  useEffect(() => {
    softkey.dispatch({ type: 'push', origin })
    return () => softkey.dispatch({ type: 'pop', origin })
  }, [origin])

  useEffect(() => {
    const config = option.config || option
    const type = option.replace ? 'replace' : 'set'
    softkey.dispatch({ type, config })
  }, dependencies)
  return softkey
}
