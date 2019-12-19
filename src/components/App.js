import { h } from 'preact'
import { useReducer, useState } from 'preact/hooks'
import { Routes, Softkey, PopupContainer } from 'components'
import { I18nContext, SoftkeyContext, PopupContext } from 'contexts'
import { SoftkeyReducer } from 'reducers'

export const App = ({ i18n }) => {
  // @todo making it used by the global state management
  const [state, dispatch] = useReducer(SoftkeyReducer, {})

  const [popupState, setPopupState] = useState({})

  return (
    <I18nContext.Provider value={i18n}>
      <SoftkeyContext.Provider value={{ state, dispatch }}>
        <PopupContext.Provider value={{ popupState, setPopupState }}>
          <Routes />
          <Softkey {...state.current} />
          <PopupContainer {...popupState} />
        </PopupContext.Provider>
      </SoftkeyContext.Provider>
    </I18nContext.Provider>
  )
}
