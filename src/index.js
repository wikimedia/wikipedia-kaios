import 'preact/debug'
import { h, render } from 'preact'
import 'intl-pluralrules'
import Banana from 'banana-i18n'
import {
  setAppLanguage, getAppLanguage, setDeviceLanguage, getDeviceLanguage,
  checkHasDeviceLanguageChanged, loadAllLanguagesMessages, consentMessages,
  setAppDirection
} from 'utils'
import { App } from 'components'

import '../style/style.less'

if (checkHasDeviceLanguageChanged()) {
  setDeviceLanguage()
  setAppLanguage(getDeviceLanguage())
}

const lang = getAppLanguage()
const banana = new Banana(lang)
banana.load(loadAllLanguagesMessages())
banana.load(consentMessages)

setAppDirection(lang)
render(<App i18n={banana} />, document.querySelector('.root'))
