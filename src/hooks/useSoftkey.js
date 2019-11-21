import { useContext } from 'preact/hooks'
import { SoftkeyContext } from 'contexts'

export const useSoftkey = () => useContext(SoftkeyContext)
