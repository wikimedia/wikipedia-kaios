import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { Routes } from 'components/routes.jsx'
import { LanguageContext } from 'contexts/LanguageContext'
import { I18nContext } from 'contexts/I18nContext'
import { loadMessages } from 'api/language'

const App = ({ lang, i18n }) => {
  return (
    <LanguageContext.Provider value={lang}>
      <I18nContext.Provider value={i18n}>
        <Routes />
      </I18nContext.Provider>
    </LanguageContext.Provider>
  )
}

const lang = navigator.language.substr(0, 2)
const banana = new Banana(lang)
loadMessages(lang).then((messages) => {
  banana.load(messages)
  render(<App lang={lang} i18n={banana} />, document.querySelector('#root'))
})
