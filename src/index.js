import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { loadSupportedLanguageMessages } from 'api'
import { App } from 'components'
import { getAppLanguage } from 'utils'
import '../style/style.less'

const lang = getAppLanguage() || navigator.language.substr(0, 2)
const banana = new Banana(lang)

const supportedLangaugeMessages = loadSupportedLanguageMessages()
banana.load(supportedLangaugeMessages)

render(<App i18n={banana} />, document.querySelector('.root'))
