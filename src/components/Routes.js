import { h } from 'preact'
import { Router, route } from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, Settings, Language, Onboarding } from 'components'
import { onboarding } from 'utils'

export const Routes = ({ onRouteChange }) => {
  const onChange = ({ url }) => {
    if (!onboarding.isDone()) {
      route('/onboarding')
    }
    onRouteChange(url)
  }
  return (
    <Router history={createHashHistory()} onChange={onChange}>
      <Onboarding path='/onboarding' />
      <Search path='/' />
      <Settings path='/settings' />
      <Article path='/article/:lang/:title/:anchor?/:page?' />
      <Language path='/language' />
    </Router>
  )
}
