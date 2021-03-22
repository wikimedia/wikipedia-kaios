import { appVersion, sendEvent, getDeviceLanguage } from 'utils'

export const sendFeedback = feedback => {
  sendEvent(
    '/analytics/legacy/kaiosappfeedback/1.0.0',
    'eventlogging_KaiOSAppFeedback',
    'KaiOSAppFeedback',
    getDeviceLanguage(),
    {
      version: appVersion(),
      feedback
    }
  )
}
