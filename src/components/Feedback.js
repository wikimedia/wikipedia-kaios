import { h } from 'preact'
import { useState } from 'preact/hooks'
import { useI18n, useSoftkey } from 'hooks'
import { sendFeedback } from 'utils'

export const Feedback = ({ close }) => {
  const i18n = useI18n()
  const [message, setMessage] = useState()

  const onKeyRight = () => {
    sendFeedback(message)
  }

  useSoftkey('Feedback', {
    right: i18n('send'),
    onKeyRight,
    left: i18n('softkey-close'),
    onKeyLeft: close,
    onKeyBackspace: close
  }, [message])

  return (
    <div class='feedback'>
      <div class='header'>{i18n('feedback-header')}</div>
      <div class='body'>
        <div class='text-box'>
          <form>
            <textarea value={message} onChange={e => setMessage(e.target.value)} />
          </form>
        </div>
        <div class='message-box'>
          <p> {i18n('feedback-explanation')} </p>
        </div>
      </div>
    </div>
  )
}
