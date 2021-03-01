import { h } from 'preact'
import { useReducer, useState, useEffect } from 'preact/hooks'
import { Routes, Softkey, PopupContainer, OfflineIndicator } from 'components'
import { DirectionContext, I18nContext, SoftkeyContext, PopupContext, FontContext } from 'contexts'
import { SoftkeyReducer } from 'reducers'
import { articleTextSize, isConsentGranted } from 'utils'
import { useErrorLogging } from 'hooks'
import { getExperimentConfig } from 'api'

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
  useEffect(() => {
    document.body.className = `font-size-${textSize + 1}`
  }, [textSize])
  // end of useTextSize

  // experiment config
  const consentGranted = isConsentGranted()
  useEffect(() => {
    function formatDate (date) {
      var d = new Date(date)
      var month = '' + (d.getMonth() + 1)
      var day = '' + d.getDate()
      var year = d.getFullYear()

      if (month.length < 2) { month = '0' + month }
      if (day.length < 2) { day = '0' + day }

      return [year, month, day].join('')
    }
    if (consentGranted) {
      const [promise,, xhr] = getExperimentConfig()
      promise.then(({ startDate, endDate, countries }) => {
        try {
          const now = parseInt(formatDate(Date.now()), 10)
          const targetCountries = Array.isArray(countries) ? [countries] : countries
          const userCountry = xhr.getResponseHeader('Set-Cookie').match(/GeoIP=(\w+)/)[1]

          if (
            now > parseInt(startDate, 10) &&
          now < parseInt(endDate, 10) &&
          targetCountries.includes(userCountry)
          ) {
          // @todo  set the user experiment group
          }
        } catch (e) {
          //
        }
      })
    }
  }, [consentGranted])

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
