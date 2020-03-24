import { useContext } from 'preact/hooks'
import { I18nContext } from 'contexts'

export const useI18n = () => {
  const i18n = useContext(I18nContext)

  i18n.getTranslation = (locale, key, ...parameters) => {
    const i18nLocale = i18n.locale
    i18n.setLocale(locale)
    const translation = i18n.i18n(key, ...parameters)
    i18n.setLocale(i18nLocale)

    return translation
  }

  return i18n
}
