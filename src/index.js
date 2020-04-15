import 'preact/debug'
import { h, render } from 'preact'
import Banana from 'banana-i18n'
import {
  setAppLanguage, getAppLanguage, setDeviceLanguage, getDeviceLanguage,
  checkHasDeviceLanguageChanged, loadAllLanguagesMessages
} from 'utils'
import { App } from 'components'

import '../style/style.less'

let banana

if (checkHasDeviceLanguageChanged()) {
  setDeviceLanguage()
  const lang = getDeviceLanguage()
  setAppLanguage(lang)
  banana = new Banana(lang)
} else {
  const lang = getAppLanguage()
  banana = new Banana(lang)
}

banana.load(loadAllLanguagesMessages())

render(<App i18n={banana} />, document.querySelector('.root'))
