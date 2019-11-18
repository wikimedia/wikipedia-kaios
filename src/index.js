import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { loadMessages } from 'api'
import { App } from 'components'
import '../style/style.less'

const lang = navigator.language.substr(0, 2)
const banana = new Banana(lang)
loadMessages(lang).then((messages) => {
  banana.load(messages)
  render(<App lang={lang} i18n={banana} />, document.querySelector('#root'))
})
