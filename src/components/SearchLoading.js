import { h } from 'preact'
import { memo } from 'preact/compat'
import { Loading } from 'components'
import { useI18n } from 'hooks'

export const SearchLoading = memo(() => {
  const i18n = useI18n()
  const message = i18n('search-loading-message')

  return <Loading message={message} />
})
