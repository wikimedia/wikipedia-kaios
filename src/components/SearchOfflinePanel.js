import { h } from 'preact'
import { useI18n } from 'hooks'

export const SearchOfflinePanel = () => {
  const i18n = useI18n()
  return (
    <div class='search-offline-panel'>
      <div class='search-offline-content'>
        <img src='images/search-offline.svg' />
        <div class='message'>{i18n('offline-message')}</div>
      </div>
    </div>
  )
}
