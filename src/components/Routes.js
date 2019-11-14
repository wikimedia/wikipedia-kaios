import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, QuickFacts } from 'components'

export const Routes = () => (
  <Router history={createHashHistory()}>
    <Search path='/' />
    <Article path='/article/:lang/:title' />
    <QuickFacts path='/quickfacts/:lang/:title' />
  </Router>
)

// todo: export navigation functions
