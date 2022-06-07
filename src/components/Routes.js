import { h } from 'preact'
import { Router, route } from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, Settings, Tips, Language, Onboarding } from 'components'
import { onboarding } from 'utils'
import { useI18n, useConfirmDialog, useGlobalEndCallKey } from 'hooks'

export const Routes = ({ onRouteChange }) => {
  const onChange = ({ url }) => {
    if (!onboarding.isDone()) {
      route('/onboarding')
    }
    onRouteChange(url)
  }

  // This is the global EndCall event
  // it will apply to all pages once user land on search page
  const i18n = useI18n()
  const showConfirmDialog = useConfirmDialog()
  useGlobalEndCallKey(() => {
    showConfirmDialog({
      title: i18n('confirm-app-close-title'),
      message: i18n('confirm-app-close-message'),
      onDiscardText: i18n('softkey-cancel'),
      onSubmitText: i18n('softkey-exit'),
      onSubmit: window.close
    })
  })

  return (
    <Router history={createHashHistory()} onChange={onChange}>
      <Onboarding path='/onboarding' />
      <Search path='/' />
      <Settings path='/settings' />
      <Tips path='/tips' />
      <Article path='/article/:lang/:title/:anchor?' />
      <Language path='/language' />
    </Router>
  )
}
