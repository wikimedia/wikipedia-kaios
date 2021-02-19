import { h } from 'preact'
import { memo } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'

const SoftkeyButton = memo(({ className, text, handler }) => {
  return <label class={className} onClick={handler}>{text}</label>
})

export const Softkey = ({
  left,
  center,
  right,
  onKeyLeft,
  onKeyCenter,
  onKeyRight,
  onKeyArrowDown,
  onKeyArrowUp,
  onKeyArrowLeft,
  onKeyArrowRight,
  onKeyBackspace,

  // direction related prop
  dir = 'ltr',
  onKeyFixedArrowLeft,
  onKeyFixedArrowRight
}) => {
  const handlersRef = useRef()

  if (dir === 'rtl') {
    [left, right] = [right, left];
    [onKeyLeft, onKeyRight] = [onKeyRight, onKeyLeft];
    [onKeyArrowLeft, onKeyArrowRight] = [onKeyArrowRight, onKeyArrowLeft]
  }

  handlersRef.current = {
    SoftLeft: onKeyLeft,
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    ArrowDown: onKeyArrowDown,
    ArrowUp: onKeyArrowUp,
    ArrowLeft: onKeyFixedArrowLeft || onKeyArrowLeft,
    ArrowRight: onKeyFixedArrowRight || onKeyArrowRight,
    Backspace: onKeyBackspace
  }
  const onKeyDown = (e) => {
    const key = e.key.toString()
    if (handlersRef.current[key]) {
      handlersRef.current[key](e)
      e.stopPropagation()
      e.preventDefault()
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  return (
    <div class='softkey'>
      <SoftkeyButton key='left' className='left' text={left} handler={onKeyLeft} />
      <SoftkeyButton key='center' className='center' text={center} handler={onKeyCenter} />
      <SoftkeyButton key='right' className='right' text={right} handler={onKeyRight} />
    </div>
  )
}
