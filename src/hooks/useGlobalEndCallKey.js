import { useEffect } from 'preact/hooks'

export const useGlobalEndCallKey = (callback) => {
  // This is the global EndCall event
  // it will apply to all pages once user land on search page
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
