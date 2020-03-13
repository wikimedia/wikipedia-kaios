import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { loadAllLanguagesMessages } from 'api'
import { App } from 'components'
import { getAppLanguage } from 'utils'
import '../style/style.less'

const lang = getAppLanguage() || navigator.language.substr(0, 2)
const banana = new Banana(lang)

const allMessages = loadAllLanguagesMessages()
banana.load(allMessages)

render(<App i18n={banana} />, document.querySelector('.root'))
