import { h } from 'preact'
import { useEffect } from 'preact/hooks'

export const Softkey = ({
  left,
  onKeyLeft,
  center,
  onKeyCenter,
  right,
  onKeyRight
}) => {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleKeyDown = evt => {
    switch (evt.key) {
      case 'SoftLeft':
        return onKeyLeft && onKeyLeft(evt)
      case 'Enter':
        return onKeyCenter && onKeyCenter(evt)
      case 'SoftRight':
      case 'ArrowRight':
        return onKeyRight && onKeyRight(evt)
      default:
    }
  }

  return (
    <div className='softkey'>
      <label className='left' onClick={onKeyLeft}>{left}</label>
      <label className='center' onClick={onKeyCenter}>{center}</label>
      <label className='right' onClick={onKeyRight}>{right}</label>
    </div>
  )
}
