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
  onKeyArrowRight
}) => {
  const handlersRef = useRef()
  handlersRef.current = {
    SoftLeft: onKeyLeft,
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    ArrowDown: onKeyArrowDown,
    ArrowUp: onKeyArrowUp,
    ArrowLeft: onKeyArrowLeft,
    ArrowRight: onKeyArrowRight
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
      <SoftkeyButton className='left' text={left} handler={onKeyLeft} />
      <SoftkeyButton className='center' text={center} handler={onKeyCenter} />
      <SoftkeyButton className='right' text={right} handler={onKeyRight} />
    </div>
  )
}
