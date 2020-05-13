import { h } from 'preact'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useI18n, useSoftkey, useNavigation } from 'hooks'
import { sendFeedback } from 'utils'

export const Feedback = ({ close }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [message, setMessage] = useState()
  const [validInput, setValidInput] = useState(null)
  const [, setNavigation, getCurrent] = useNavigation('Feedback', containerRef, containerRef, 'y')

  const onKeyRight = () => {
    if (message) {
      sendFeedback(message)
      setValidInput(true)
    } else {
      setValidInput(false)
    }
  }

  const onKeyBackspace = () => {
    if (message && getCurrent().type === 'TEXTAREA') {
      setMessage(message.slice(0, -1))
    } else {
      close()
    }
  }

  const handleChange = (message) => {
    setMessage(message)
    setValidInput(null)
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
  }, [validInput])

  useEffect(() => {
    if (validInput === true) {
      const timer = setTimeout(() => {
        setValidInput(null)
      }, 4000)
      return () => clearTimeout(timer)
    }
  }, [validInput])

  return (
    <div class='feedback' ref={containerRef}>
      <div class='header'>
        {i18n('feedback-header')}
        {validInput === true ? <div class='success'><span>{i18n('feedback-success')}</span></div> : null}
      </div>
      <div class='body'>
        <div class='textarea-box'>
          <form>
            <textarea class={validInput === false ? 'border-error' : 'border-regular'} value={message} placeholder={i18n('feedback-placeholder')} onChange={e => handleChange(e.target.value)} data-selectable />
            {validInput === false ? <div class='error'>{i18n('feedback-error')}</div> : null}
          </form>
        </div>
        <div class='explanation-box'>
          <p> {i18n('feedback-explanation')} </p>
        </div>
      </div>
    </div>
  )
}
