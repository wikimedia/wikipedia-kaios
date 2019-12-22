import { h } from 'preact'
import { useEffect, useState } from 'preact/hooks'
import { useI18n } from 'hooks'

export const OfflineIndicator = ({ routeUrl }) => {
  const i18n = useI18n()
  const [isOnline, setOnline] = useState(navigator.onLine)
  const [isVisible, setVisible] = useState()

  const onOnlineChange = () => {
    setOnline(navigator.onLine)
  }

  useEffect(() => {
    window.addEventListener('offline', onOnlineChange)
    window.addEventListener('online', onOnlineChange)
    return () => {
      window.removeEventListener('offline', onOnlineChange)
      window.removeEventListener('online', onOnlineChange)
    }
  }, [])

  useEffect(() => {
    setVisible(!isOnline)
    if (!isOnline) {
      setTimeout(() => { setVisible(false) }, 3000)
    }
  }, [isOnline, routeUrl])

  if (isVisible) {
    return <div class='offline'>{i18n.i18n('offline-message')}</div>
  }
}
