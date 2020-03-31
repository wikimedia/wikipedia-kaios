import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts'
import { getAppLanguage } from 'utils'

export const useI18n = lang => {
  const banana = useContext(I18nContext)

  return (key, ...args) => {
    if (lang) {
      const locale = banana.locale
      let msg
      try {
        banana.setLocale(lang)
      } finally {
        msg = banana.i18n(key, ...args)
        banana.setLocale(locale)
      }

      return msg
    }

    // the script executes this line only
    // when changing the app interface langauge
    if (banana.locale !== getAppLanguage()) {
      banana.setLocale(getAppLanguage())
    }

    return banana.i18n(key, ...args)
  }
}
