import { useEffect, useState } from 'preact/hooks'
import { getExperimentConfig } from 'api'
import { isConsentGranted, isTrendingArticlesGroup } from 'utils'

const STORAGE_KEY = '2021-KaiOS-app-engagement-config'
const USER_COUNTRY_STORAGE_KEY = 'user-country'
const DAY_TIMESTAMP = 24 * 60 * 60 * 1000
const SUPPORTED_LANGUAGES = ['en']

const formatDate = date => {
  const d = new Date(date)
  const year = d.getFullYear()
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()

  if (month.length < 2) { month = '0' + month }
  if (day.length < 2) { day = '0' + day }

  return [year, month, day].join('')
}

const isUserUnderExperimentGroup = (startDate, endDate, countries) => {
  const now = parseInt(formatDate(Date.now()), 10)
  const targetCountries = Array.isArray(countries) ? countries : [countries]
  const userCountry = localStorage.getItem(USER_COUNTRY_STORAGE_KEY)

  if (
    now >= parseInt(startDate, 10) &&
    now <= parseInt(endDate, 10) &&
    targetCountries.includes(userCountry)
  ) {
    return isTrendingArticlesGroup()
  } else {
    return false
  }
}

export const useExperimentConfig = (lang) => {
  const [isExperimentGroup, setIsExperimentGroup] = useState()
  const consentGranted = isConsentGranted()

  // the app language is not supported
  if (!SUPPORTED_LANGUAGES.includes(lang)) {
    setIsExperimentGroup(false)
    return isExperimentGroup
  }

  const nowTimestamp = Date.now()
  const { timestamp, startDate, endDate, countries } = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}
  const hasRecordBefore = timestamp && ((nowTimestamp - timestamp) < DAY_TIMESTAMP)

  // previous record found
  if (hasRecordBefore) {
    setIsExperimentGroup(isUserUnderExperimentGroup(startDate, endDate, countries))
  }

  useEffect(() => {
    // no record found or record found but expire
    if (consentGranted && !hasRecordBefore) {
      const [promise] = getExperimentConfig()
      promise.then(({ startDate, endDate, countries }) => {
        localStorage.setItem(STORAGE_KEY,
          JSON.stringify({ timestamp: Date.now(), startDate, endDate, countries })
        )
        setIsExperimentGroup(isUserUnderExperimentGroup(startDate, endDate, countries))
      })
    }
  }, [consentGranted])

  return isExperimentGroup
}
