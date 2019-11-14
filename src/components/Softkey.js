import { h } from 'preact'
import { useKeys } from 'hooks'

export const Softkey = ({
  left,
  onKeyLeft,
  center,
  onKeyCenter,
  right,
  onKeyRight
}) => {
  useKeys({
    SoftLeft: onKeyLeft,
    Enter: onKeyCenter,
    SoftRight: onKeyRight
  })

  return (
    <div className='softkey'>
      <label className='left' onClick={onKeyLeft}>{left}</label>
      <label className='center' onClick={onKeyCenter}>{center}</label>
      <label className='right' onClick={onKeyRight}>{right}</label>
    </div>
  )
}
