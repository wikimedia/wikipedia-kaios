import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts'
import { getAppLanguage } from 'utils'

export const useI18n = (lang = getAppLanguage()) => {
  const banana = useContext(I18nContext)

  return (key, ...args) => {
    if (lang !== banana.locale) {
      banana.setLocale(lang)
    }

    return banana.i18n(key, ...args)
  }
}
