import { useEffect, useState } from 'preact/hooks'

export const useOnlineStatus = (onChange) => {
  const [isOnline, setOnline] = useState(navigator.onLine)

  const onOnlineChange = () => {
    setOnline(navigator.onLine)
    if (onChange) {
      onChange(navigator.onLine)
    }
  }

  // setInterval(() => {
  //   setOnline(!isOnline)
  // }, 2000)

  useEffect(() => {
    window.addEventListener('offline', onOnlineChange)
    window.addEventListener('online', onOnlineChange)
    return () => {
      window.removeEventListener('offline', onOnlineChange)
      window.removeEventListener('online', onOnlineChange)
    }
  }, [])

  return isOnline
}
