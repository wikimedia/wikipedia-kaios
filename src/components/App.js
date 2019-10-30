import { h } from 'preact'
import { Routes } from 'components'
import { LanguageContext, I18nContext } from 'contexts'

export const App = ({ lang, i18n }) => {
  return (
    <LanguageContext.Provider value={lang}>
      <I18nContext.Provider value={i18n}>
        <Routes />
      </I18nContext.Provider>
    </LanguageContext.Provider>
  )
}
