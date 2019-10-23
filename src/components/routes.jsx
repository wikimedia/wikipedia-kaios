import { h } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import Article from './article.jsx'
import Home from './home.jsx'

const Routes = () => (
  <Router history={createHashHistory()}>
    <Home path='/' />
    <Article path='/:lang/:title' />
  </Router>
)

export default Routes
