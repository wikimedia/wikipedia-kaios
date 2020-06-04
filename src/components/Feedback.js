import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useI18n, useSoftkey, useNavigation, usePopup, useOnlineStatus } from 'hooks'
import { sendFeedback } from 'utils'
import { SearchOfflinePanel } from 'components'

export const Feedback = ({ close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [message, setMessage] = useState()
  const [showSuccessConfirmation] = usePopup(SuccessConfirmationPopup, { stack: true })
  const [showCancelConfirmation] = usePopup(CancelConfirmationPopup, { stack: true })
  const [, setNavigation, getCurrent] = useNavigation('Feedback', containerRef, containerRef, 'y')
  const isOnline = useOnlineStatus()

  const items = [
    { text: `<a data-selectable>${i18n('feedback-privacy-policy')}</a>`, link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { text: `<a data-selectable>${i18n('feedback-terms-of-use')}</a>`, link: 'https://foundation.m.wikimedia.org/wiki/Terms_of_Use/en' }
  ]
  const hyperlinks = items.map(i => i.text)

  const onKeyRight = () => {
    const userMessage = message.trim()
    if (isOnline && userMessage) {
      sendFeedback(userMessage)
      if (getCurrent().type === 'TEXTAREA') {
        blurTextarea()
      }
      showSuccessConfirmation()
    }
  }

  const onKeyBackspace = () => {
    if (isOnline && message && getCurrent().type === 'TEXTAREA') {
      setMessage(message.slice(0, -1))
    } else {
      close()
    }
  }

  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const item = items[index - 1]
      window.open(item.link)
    }
  }

  const onKeyLeft = () => {
    if (isOnline && message) {
      if (getCurrent().type === 'TEXTAREA') {
        blurTextarea()
      }
      showCancelConfirmation()
    } else {
      close()
    }
  }

  const blurTextarea = () => {
    const element = containerRef.current.querySelector('textarea')
    element.blur()
  }

  useSoftkey('Feedback', {
    right: isOnline && message && message.trim() ? i18n('softkey-send') : '',
    onKeyRight,
    left: i18n('softkey-cancel'),
    onKeyLeft,
    onKeyBackspace,
    onKeyCenter
  }, [message, isOnline])

  useEffect(() => {
    setNavigation(0)
  }, [isOnline])

  return (
    <div class='feedback' ref={containerRef}>
      <div class='header'>
        {i18n('feedback-header')}
      </div>
      <div class='body'>
        { isOnline
          ? <div>
            <div class='textarea-box'>
              <form>
                <textarea value={message} placeholder={i18n('feedback-placeholder')} onChange={e => setMessage(e.target.value)} data-selectable />
              </form>
            </div>
            <div class='explanation-box'>
              <p dangerouslySetInnerHTML={{ __html: i18n('feedback-explanation', ...hyperlinks) }}> </p>
            </div>
          </div>
          : <SearchOfflinePanel />
        }
      </div>
    </div>
  )
}

const SuccessConfirmationPopup = ({ closeAll }) => {
  const i18n = useI18n()

  useSoftkey('FeedbackSuccessMessage', {
    center: i18n('softkey-ok'),
    onKeyCenter: closeAll,
    onKeyBackspace: closeAll
  }, [])

  return (
    <div class='confirmation-popup'>
      <div class='header'>{i18n('feedback-success-header')}</div>
      <p class='preview-text success'>{i18n('feedback-success')}</p>
    </div>
  )
}

const CancelConfirmationPopup = ({ close, closeAll }) => {
  const i18n = useI18n()

  useSoftkey('FeedbackCancelMessage', {
    right: i18n('softkey-yes'),
    onKeyRight: closeAll,
    left: i18n('softkey-no'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [])

  return (
    <div class='confirmation-popup'>
      <div class='header'>{i18n('feedback-cancel-header')}</div>
      <p class='preview-text cancel'>{i18n('feedback-cancel')}</p>
    </div>
  )
}
