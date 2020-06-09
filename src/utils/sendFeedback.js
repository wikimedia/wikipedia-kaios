import { appVersion, getAppLanguage, sendEvent } from 'utils'

export const sendFeedback = feedback => {
  sendEvent(
    'KaiOSAppFeedback',
    20044947,
    getAppLanguage(),
    {
      version: appVersion(),
      feedback
    }
  )
}
