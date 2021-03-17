import { appVersion, sendEvent } from 'utils'

export const sendFeedback = feedback => {
  sendEvent(
    '/analytics/legacy/kaiosappfeedback/1.0.0',
    'eventlogging_KaiOSAppFeedback',
    {
      version: appVersion(),
      feedback
    }
  )
}
