import { useEffect } from 'preact/hooks'

export const useGlobalEndCallKey = (callback) => {
  useEffect(() => {
    const onKeyEndCall = (e) => {
      const key = e.key.toString()

      if (key === 'EndCall') {
        callback()
        e.stopPropagation()
        e.preventDefault()
      }
    }

    document.addEventListener('keydown', onKeyEndCall)
  }, [])
}
