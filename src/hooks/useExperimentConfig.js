import { useEffect, useState } from 'preact/hooks'
import { getExperimentConfig } from 'api'
import { isConsentGranted, isTrendingArticlesGroup } from 'utils'

const STORAGE_KEY = '2021-KaiOS-app-engagement-config'
const DAY_TIMESTAMP = 24 * 60 * 60 * 1000
const SUPPORTED_LANGUAGES = ['en']

function formatDate (date) {
  const d = new Date(date)
  const year = d.getFullYear()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return [year, month, day].join('')
}

export const useExperimentConfig = (lang) => {
  const [isExperimentGroup, setIsExperimentGroup] = useState()
  const consentGranted = isConsentGranted()

  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    setIsExperimentGroup(false)
    return isExperimentGroup
  }

  useEffect(() => {
    const nowTimestamp = Date.now()
    const { timestamp } = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
    const hasRecordBefore = timestamp && ((nowTimestamp - timestamp) < DAY_TIMESTAMP)

    if (hasRecordBefore) {
      setIsExperimentGroup(isTrendingArticlesGroup())
    } else if (!hasRecordBefore && consentGranted) {
      const [promise,, xhr] = getExperimentConfig()
      promise.then(({ startDate, endDate, countries }) => {
        try {
          const now = parseInt(formatDate(Date.now()), 10)
          const targetCountries = Array.isArray(countries) ? countries : [countries]
          const userCountry = xhr.getResponseHeader('Set-Cookie').match(/GeoIP=(\w+)/)[1]

          localStorage.setItem(STORAGE_KEY,
            JSON.stringify({ timestamp: nowTimestamp, startDate, endDate, countries })
          )

          if (
            now >= parseInt(startDate, 10) &&
          now <= parseInt(endDate, 10) &&
          targetCountries.includes(userCountry)
          ) {
            setIsExperimentGroup(isTrendingArticlesGroup())
          } else {
            setIsExperimentGroup(false)
          }
        } catch (e) {
          // in desktop browser, xhr getResponseHeader from Set-Cookie is not allowed
          // set the key so it won't request the config the next time
          localStorage.setItem(STORAGE_KEY,
            JSON.stringify({ timestamp: nowTimestamp })
          )
          setIsExperimentGroup(false)
        }
      })
    }
  }, [consentGranted])

  return isExperimentGroup
}
