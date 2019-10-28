import { h } from 'preact'
import { Routes } from 'components/routes.jsx'
import { LanguageContext } from 'contexts/LanguageContext'
import { I18nContext } from 'contexts/I18nContext'

export const App = ({ lang, i18n }) => {
  return (
    <LanguageContext.Provider value={lang}>
      <I18nContext.Provider value={i18n}>
        <Routes />
      </I18nContext.Provider>
    </LanguageContext.Provider>
  )
}
