import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useI18n, useSoftkey, useNavigation } from 'hooks'
import { sendFeedback } from 'utils'

export const Feedback = ({ close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [message, setMessage] = useState()
  const [, setNavigation, getCurrent] = useNavigation('Feedback', containerRef, containerRef, 'y')

  const onKeyRight = () => {
    sendFeedback(message)
  }

  const onKeyBackspace = () => {
    if (message && getCurrent().type === 'TEXTAREA') {
      setMessage(message.slice(0, -1))
    } else {
      close()
    }
  }

  useSoftkey('Feedback', {
    right: i18n('send'),
    onKeyRight,
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace
  }, [message])

  useEffect(() => {
    setNavigation(0)
  }, [])

  return (
    <div class='feedback' ref={containerRef}>
      <div class='header'>{i18n('feedback-header')}</div>
      <div class='body'>
        <div class='text-box'>
          <form>
            <textarea value={message} placeholder={i18n('feedback-placeholder')} onChange={e => setMessage(e.target.value)} data-selectable />
          </form>
        </div>
        <div class='message-box'>
          <p> {i18n('feedback-explanation')} </p>
        </div>
      </div>
    </div>
  )
}
