import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useScroll } from 'hooks'

export const Pager = ({ children, event }) => {
  const containerRef = useRef()
  useScroll(containerRef, 240, 'x', event)
  return (
    <div class='pages-container' ref={containerRef}>
      <div class='pages'>{children}</div>
    </div>
  )
}
