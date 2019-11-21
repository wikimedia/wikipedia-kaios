import { h } from 'preact'
import { useReducer } from 'preact/hooks'
import { Routes, Softkey } from 'components'
import { LanguageContext, I18nContext, SoftkeyContext } from 'contexts'
import { SoftkeyReducer } from 'reducers'

export const App = ({ lang, i18n }) => {
  // @todo making it used by the global state management
  const [state, dispatch] = useReducer(SoftkeyReducer, {})

  return (
    <LanguageContext.Provider value={lang}>
      <I18nContext.Provider value={i18n}>
        <SoftkeyContext.Provider value={{ state, dispatch }}>
          <Routes />
          <Softkey {...state} />
        </SoftkeyContext.Provider>
      </I18nContext.Provider>
    </LanguageContext.Provider>
  )
}
