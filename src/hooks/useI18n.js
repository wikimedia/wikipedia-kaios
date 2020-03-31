import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts'
import { getAppLanguage } from 'utils'

export const useI18n = lang => {
  const banana = useContext(I18nContext)
  banana.setLocale(getAppLanguage())

  return (key, ...args) => {
    if (lang) {
      const locale = banana.locale
      banana.setLocale(lang)
      const msg = banana.i18n(key, args)
      banana.setLocale(locale)
      return msg
    }
    return banana.i18n(key, ...args)
  }
}
