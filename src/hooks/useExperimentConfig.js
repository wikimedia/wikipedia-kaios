import { useEffect, useState } from 'preact/hooks'
import { getExperimentConfig } from 'api'
import { isConsentGranted, isTrendingArticlesGroup, getUserCountry } from 'utils'

const STORAGE_KEY = '2021-KaiOS-app-engagement-config'

const formatDate = date => {
  const d = new Date(date)
  const year = d.getFullYear()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return [year, month, day].join('')
}

const isUserUnderExperimentGroup = (startDate, endDate, countries, languages, appLanguage) => {
  const now = parseInt(formatDate(Date.now()), 10)
  const targetCountries = Array.isArray(countries) ? countries : [countries]
  const userCountry = getUserCountry()
  const targetLanguages = Array.isArray(languages) ? languages : [languages]

  if (
    now >= parseInt(startDate, 10) &&
    now <= parseInt(endDate, 10) &&
    targetCountries.includes(userCountry) &&
    targetLanguages.includes(appLanguage)
  ) {
    return isTrendingArticlesGroup()
  } else {
    return false
  }
}

const isSameDay = (ts1, ts2) => {
  return formatDate(ts1) === formatDate(ts2)
}

export const useExperimentConfig = lang => {
  const [isExperimentGroup, setIsExperimentGroup] = useState()
  const consentGranted = isConsentGranted()
  const { timestamp, startDate, endDate, countries, languages } = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  const hasRecordBefore = timestamp && isSameDay(Date.now(), timestamp)

  useEffect(() => {
    // previous record found
    if (hasRecordBefore) {
      setIsExperimentGroup(isUserUnderExperimentGroup(startDate, endDate, countries, languages, lang))
    } else if (consentGranted && !hasRecordBefore) {
      // no record found or record found but expire
      const [promise] = getExperimentConfig()
      promise.then(({ startDate, endDate, countries, languages }) => {
        localStorage.setItem(STORAGE_KEY,
          JSON.stringify({ timestamp: Date.now(), startDate, endDate, countries, languages })
        )
        setIsExperimentGroup(isUserUnderExperimentGroup(startDate, endDate, countries, languages, lang))
      })
    }
  }, [consentGranted])

  return isExperimentGroup
}
