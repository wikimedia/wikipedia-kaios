import { h } from 'preact'
import { memo } from 'preact/compat'
import { useI18n } from 'hooks'

export const OfflinePanel = memo(() => {
  const i18n = useI18n()
  return (
    <div class='offline-panel'>
      <div class='offline-content'>
        <img src='images/offline.svg' />
        <div class='message'>{i18n('offline-message')}</div>
      </div>
    </div>
  )
})
