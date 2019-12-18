import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import { Article, Search, Settings, QuickFacts, Language } from 'components'

export const Routes = () => (
  <Router history={createHashHistory()}>
    <Search path='/' />
    <Settings path='/settings' />
    <Article path='/article/:lang/:title/:subtitle?' />
    <QuickFacts path='/quickfacts/:lang/:title' />
    <Language path='/language' />
  </Router>
)

// todo: export navigation functions
