import { useEffect } from 'preact/hooks'

export const useBackToSearch = () => {
  const onKeyDown = (e) => {
    if (e.key.toString() === 'Backspace') {
      // note: 'Backspace' is the red "hang up" button
      // Todo: encapsulate navigation instead of hardcoding URLs
      window.location.hash = '/'
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])
}
