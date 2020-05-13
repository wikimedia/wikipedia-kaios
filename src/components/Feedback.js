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

  const items = [
    { text: `<a data-selectable>${i18n('feedback-terms-of-survey')}</a>`, link: 'https://wikimediafoundation.org/' }, // TODO: link not provided yet
    { text: `<a data-selectable>${i18n('feedback-privacy-policy')}</a>`, link: 'https://foundation.m.wikimedia.org/wiki/Privacy_policy' },
    { text: `<a data-selectable>${i18n('feedback-terms-of-use')}</a>`, link: 'https://foundation.m.wikimedia.org/wiki/Terms_of_Use/en' }
  ]
  const hyperlinks = items.map(i => i.text)

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

  const onKeyCenter = () => {
    const { index } = getCurrent()
    if (index > 0) {
      const item = items[index - 1]
      window.open(item.link)
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
    onKeyBackspace,
    onKeyCenter
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
          <p dangerouslySetInnerHTML={{ __html: i18n('feedback-explanation', ...hyperlinks) }}> </p>
        </div>
      </div>
    </div>
  )
}
