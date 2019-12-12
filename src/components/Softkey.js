import { h } from 'preact'
import { memo } from 'preact/compat'
import { useKeys } from 'hooks'

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
  onKeyLeft,
  center,
  onKeyCenter,
  right,
  onKeyRight,
  onKeyArrowDown,
  onKeyArrowUp,
  onKeyArrowLeft,
  onKeyArrowRight
}) => {
  useKeys({
    SoftLeft: onKeyLeft,
    l: onKeyLeft, // for testing purposes
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    r: onKeyRight, // for testing purposes
    ArrowDown: onKeyArrowDown,
    ArrowUp: onKeyArrowUp,
    ArrowLeft: onKeyArrowLeft,
    ArrowRight: onKeyArrowRight
  })

  return <SoftkeyBar left={left} center={center} right={right} />
}
