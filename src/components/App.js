import { h } from 'preact'
import { useReducer, useState, useEffect, useLayoutEffect } from 'preact/hooks'
import { Routes, Softkey, PopupContainer, OfflineIndicator } from 'components'
import { DirectionContext, I18nContext, SoftkeyContext, PopupContext, FontContext } from 'contexts'
import { SoftkeyReducer } from 'reducers'
import { articleTextSize } from 'utils'
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

  // useTextSize
  const [textSize, setTextSize] = useState(articleTextSize.get())
  useLayoutEffect(() => {
    document.body.className = `font-size-${textSize + 1}`
  }, [textSize])
  // end of useTextSize

  useErrorLogging()

  return (
    <I18nContext.Provider value={i18n}>
      <SoftkeyContext.Provider value={{ state, dispatch }}>
        <PopupContext.Provider value={{ popupState, setPopupState }}>
          <DirectionContext.Provider value={{ dirState, setDirState }}>
            <FontContext.Provider value={{ textSize, setTextSize }}>
              <OfflineIndicator routeUrl={url} />
              <Routes onRouteChange={({ url }) => setUrl(url)} />
              <Softkey dir={dirState} {...state.current} />
              <PopupContainer popups={popupState} />
            </FontContext.Provider>
          </DirectionContext.Provider>
        </PopupContext.Provider>
      </SoftkeyContext.Provider>
    </I18nContext.Provider>
  )
}
