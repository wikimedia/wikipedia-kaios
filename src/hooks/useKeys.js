import { useEffect } from 'preact/hooks'

export const useKeys = (handlers) => {
  const onKeyDown = (e) => {
    const key = e.key.toString()
    if (handlers[key]) {
      handlers[key](e)
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
}
