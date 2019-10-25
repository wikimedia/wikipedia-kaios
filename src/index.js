import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { Routes } from 'components/routes.jsx'
import { LanguageContext } from './LanguageContext'

const App = ({ lang }) => {
  return (
    <LanguageContext.Provider value={lang}>
      <Routes />
    </LanguageContext.Provider>
  )
}

const lang = navigator.language.substr(0, 2)
const banana = new Banana(lang)
fetch('i18n/' + lang + '.json')
  .then((response) => response.json())
  .then((messages) => banana.load(messages, lang))
  .then(() => {

  })

render(<App lang={lang} />, document.querySelector('#root'))
