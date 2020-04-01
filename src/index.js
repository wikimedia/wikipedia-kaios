import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import { setAppLanguage, getAppLanguage, loadAllLanguagesMessages } from 'utils'
import { App } from 'components'

import '../style/style.less'

const lang = getAppLanguage() || navigator.language.substr(0, 2)
setAppLanguage(lang)
const banana = new Banana(lang)

banana.load(loadAllLanguagesMessages())

render(<App i18n={banana} />, document.querySelector('.root'))
