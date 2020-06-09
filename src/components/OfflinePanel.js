import { h } from 'preact'
import { useI18n } from 'hooks'

export const OfflinePanel = () => {
  const i18n = useI18n()
  return (
    <div class='offline-panel'>
      <div class='offline-content'>
        <img src='images/offline.svg' />
        <div class='message'>{i18n('offline-message')}</div>
      </div>
    </div>
  )
}
