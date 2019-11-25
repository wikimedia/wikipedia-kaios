import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useScroll } from 'hooks'

export const Pager = ({ children, header }) => {
  const containerRef = useRef()
  useScroll(containerRef, 240, 'x')
  return (
    <div class='pages-container' ref={containerRef}>
      {/* { header && <div class='header'>{header}</div> } */}
      <div class='pages'>
        {children}
      </div>
    </div>
  )
}
