import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { memo } from 'preact/compat'
import { useI18n, useSoftkey, useNavigation, usePopup, useOnlineStatus } from 'hooks'
import { sendFeedback, confirmDialog, openExternal } from 'utils'
import { OfflinePanel } from 'components'

export const Feedback = ({ close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [message, setMessage] = useState()
  const [showSuccessConfirmation] = usePopup(SuccessConfirmationPopup, { stack: true })
  const [current, setNavigation, getCurrent] = useNavigation('Feedback', containerRef, containerRef, 'y')
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

  const showCancelConfirmation = () => {
    confirmDialog({
      title: i18n('feedback-cancel-header'),
      message: i18n('feedback-cancel'),
      onDiscardText: i18n('softkey-no'),
      onSubmitText: i18n('softkey-yes')
    })
  }

  const onKeyBackspaceHandler = () => {
    if (message) {
      showCancelConfirmation()
    } else {
      close()
    }
  }

  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const item = items[index - 1]
      openExternal(item.link)
    }
  }

  const onKeyLeft = () => {
    if (message) {
      if (isOnline && getCurrent().type === 'TEXTAREA') {
        blurTextarea()
      }
      showCancelConfirmation()
    } else {
      close()
    }
  }

  const onKeyArrowRightHandler = () => {
    const { index } = getCurrent()
    if (items[index]) {
      setNavigation(index + 1)
    } else {
      setNavigation(1)
    }
  }

  const onKeyArrowLeftHandler = () => {
    const { index } = getCurrent()
    if (items[index - 2]) {
      setNavigation(index - 1)
    } else {
      setNavigation(items.length)
    }
  }

  const getTextareaElement = () => containerRef.current.querySelector('textarea')

  const blurTextarea = () => {
    const element = getTextareaElement()
    element.blur()
  }

  useSoftkey('Feedback', {
    right: isOnline && message && message.trim() ? i18n('softkey-send') : '',
    onKeyRight,
    left: i18n('softkey-cancel'),
    onKeyLeft,
    onKeyBackspace: !(message && current.type === 'TEXTAREA') && (() => onKeyBackspaceHandler()),
    onKeyCenter,
    onKeyArrowRight: !(current.type === 'TEXTAREA') && (() => onKeyArrowRightHandler()),
    onKeyArrowLeft: !(current.type === 'TEXTAREA') && (() => onKeyArrowLeftHandler())
  }, [message, isOnline, current])

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
          : <OfflinePanel />
        }
      </div>
    </div>
  )
}

const SuccessConfirmationPopup = memo(({ closeAll }) => {
  const i18n = useI18n()

  useSoftkey('FeedbackSuccessMessage', {
    center: i18n('softkey-ok'),
    onKeyCenter: closeAll,
    onKeyBackspace: closeAll
  }, [])

  return (
    <div class='confirmation-popup'>
      <div class='header'>{i18n('feedback-success-header')}</div>
      <p class='preview-text'>{i18n('feedback-success')}</p>
    </div>
  )
})
