import { h } from 'preact'
import { memo } from 'preact/compat'
import { useEffect, useRef } from 'preact/hooks'

const SoftkeyBar = memo(({ left, center, right }) => {
  return (
    <div class='softkey'>
      <label class='left'>{left}</label>
      <label class='center'>{center}</label>
      <label class='right'>{right}</label>
    </div>
  )
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
    l: onKeyLeft, // for testing purposes
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    r: onKeyRight, // for testing purposes
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

  return <SoftkeyBar left={left} center={center} right={right} />
}
