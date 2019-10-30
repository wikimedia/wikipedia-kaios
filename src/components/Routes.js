import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search } from 'components'

export const Routes = () => (
  <Router history={createHashHistory()}>
    <Search path='/' />
    <Article path='/:lang/:title' />
  </Router>
)
