import { h } from 'preact'
import { useScroll } from 'hooks'

export const Pager = ({ children, event, containerRef }) => {
  useScroll(containerRef, 240, 'x', event)
  return (
    <div class='pages-container' ref={containerRef}>
      <div class='pages'>{children}</div>
    </div>
  )
}
