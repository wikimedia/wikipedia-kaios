import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import Article from './article.jsx'
import Search from './search.jsx'

const Routes = () => (
  <Router history={createHashHistory()}>
    <Search path='/' />
    <Article path='/:lang/:title' />
  </Router>
)

export default Routes
