import { h } from 'preact'
import { useKeys } from 'hooks'

export const Softkey = ({
  left,
  onKeyLeft,
  center,
  onKeyCenter,
  right,
  onKeyRight,
  onKeyArrowDown,
  onKeyArrowUp
}) => {
  useKeys({
    SoftLeft: onKeyLeft,
    Enter: onKeyCenter,
    SoftRight: onKeyRight,
    ArrowDown: onKeyArrowDown,
    ArrowUp: onKeyArrowUp
  })

  return (
    <div className='softkey'>
      <label className='left' onClick={onKeyLeft}>{left}</label>
      <label className='center' onClick={onKeyCenter}>{center}</label>
      <label className='right' onClick={onKeyRight}>{right}</label>
    </div>
  )
}
