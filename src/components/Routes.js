import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, Settings, QuickFacts } from 'components'

export const Routes = () => (
  <Router history={createHashHistory()}>
    <Search path='/' />
    <Settings path='/settings' />
    <Article path='/article/:lang/:title/:subtitle?' />
    <QuickFacts path='/quickfacts/:lang/:title' />
  </Router>
)

// todo: export navigation functions
