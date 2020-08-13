import { h } from 'preact'
import { useReducer, useState, useEffect } from 'preact/hooks'
import { Routes, Softkey, PopupContainer, OfflineIndicator } from 'components'
import { DirectionContext, I18nContext, SoftkeyContext, PopupContext } from 'contexts'
import { SoftkeyReducer } from 'reducers'
import { useErrorLogging } from 'hooks'

export const App = ({ i18n, dir }) => {
  // @todo making it used by the global state management
  const [state, dispatch] = useReducer(SoftkeyReducer, {})
  const [popupState, setPopupState] = useState([])
  const [url, setUrl] = useState()

  // useDirection
  const [dirState, setDirState] = useState(dir)
  useEffect(() => {
    document.body.setAttribute('dir', dirState)
  }, [dirState])
  // end of useDirection

  useErrorLogging()

  return (
    <I18nContext.Provider value={i18n}>
      <SoftkeyContext.Provider value={{ state, dispatch }}>
        <PopupContext.Provider value={{ popupState, setPopupState }}>
          <DirectionContext.Provider value={{ dirState, setDirState }}>
            <OfflineIndicator routeUrl={url} />
            <Routes onRouteChange={({ url }) => setUrl(url)} />
            <Softkey dir={dirState} {...state.current} />
            <PopupContainer popups={popupState} />
          </DirectionContext.Provider>
        </PopupContext.Provider>
      </SoftkeyContext.Provider>
    </I18nContext.Provider>
  )
}
