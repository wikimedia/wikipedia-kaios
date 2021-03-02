import { useEffect, useState } from 'preact/hooks'
import { getExperimentConfig } from 'api'
import { isConsentGranted, setExperimentGroup, clearExperimentGroup } from 'utils'

const STORAGE_KEY = '2021-KaiOS-app-engagement-config'
const DAY_TIMESTAMP = 24 * 60 * 60 * 1000

function formatDate (date) {
  const d = new Date(date)
  const year = d.getFullYear()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return [year, month, day].join('')
}

export const useExperimentConfig = () => {
  const [isExperimentGroup, setIsExperimentGroup] = useState()
  const consentGranted = isConsentGranted()

  useEffect(() => {
    const nowTimestamp = Date.now()
    const { timestamp, include } = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    const hasRecordBefore = timestamp && ((nowTimestamp - timestamp) < DAY_TIMESTAMP)

    if (hasRecordBefore) {
      setIsExperimentGroup(include)
    } else if (!hasRecordBefore && consentGranted) {
      const [promise,, xhr] = getExperimentConfig()
      promise.then(({ startDate, endDate, countries }) => {
        try {
          const now = parseInt(formatDate(Date.now()), 10)
          const targetCountries = Array.isArray(countries) ? countries : [countries]
          const userCountry = xhr.getResponseHeader('Set-Cookie').match(/GeoIP=(\w+)/)[1]

          if (
            now >= parseInt(startDate, 10) &&
          now <= parseInt(endDate, 10) &&
          targetCountries.includes(userCountry)
          ) {
            localStorage.setItem(STORAGE_KEY,
              JSON.stringify({ timestamp: nowTimestamp, startDate, endDate, countries, include: true })
            )
            setExperimentGroup()
            setIsExperimentGroup(true)
          } else {
            localStorage.setItem(STORAGE_KEY,
              JSON.stringify({ timestamp: nowTimestamp, include: false })
            )
            clearExperimentGroup()
            setIsExperimentGroup(false)
          }
        } catch (e) {
          // in desktop browser, xhr getResponseHeader from Set-Cookie is not allowed
          // set the key so it won't request the config the next time
          localStorage.setItem(STORAGE_KEY,
            JSON.stringify({ timestamp: nowTimestamp, include: false })
          )
          clearExperimentGroup()
          setIsExperimentGroup(false)
        }
      })
    }
  }, [consentGranted])

  return isExperimentGroup
}
