import 'preact/debug'
import { h, render } from 'preact'
import Router from 'preact-router'
import { createHashHistory } from 'history'
import Banana from 'banana-i18n'
import Article from './article.jsx'
import Home from './home.jsx'

const lang = navigator.language.substr(0, 2)
const banana = new Banana(lang)
fetch('i18n/' + lang + '.json')
  .then((response) => response.json())
  .then((messages) => banana.load(messages, lang))
  .then(() => {
    // const root = document.querySelector('#root');
    // root.innerText = banana.i18n( 'app-title' );
  })

const root = document.querySelector('#root')

const Main = () => (
  <Router history={createHashHistory()}>
    <Home path='/' />
    <Article path='/:lang/:title' />
  </Router>
)

render(<Main />, root)
