import { useContext, useEffect } from 'preact/hooks'
import { SoftkeyContext } from 'contexts'

export const useSoftkey = (origin, newContext, config = null, dependencies = []) => {
  const softkey = useContext(SoftkeyContext)
  // todo: push the stack concept all the way down to useKeys
  // so that other handlers (useNavigation) don't work while
  // a popup is open
  useEffect(() => {
    console.log('useSoftkey', origin, newContext)
    newContext && softkey.dispatch({ type: 'push' })
    return () => { newContext && softkey.dispatch({ type: 'pop' }) }
  }, [newContext])

  useEffect(() => {
    if (config) {
      softkey.dispatch({ type: 'set', config })
    }
  }, dependencies)
  return softkey
}
