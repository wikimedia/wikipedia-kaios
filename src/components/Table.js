import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useScroll } from 'hooks'

export const Table = ({ close, content }) => {
  const containerRef = useRef()
  const i18n = useI18n()
  const [scrollDown, scrollUp] = useScroll(containerRef, 20, 'y')
  const [scrollRight, scrollLeft] = useScroll(containerRef, 20, 'x')

  useSoftkey('Table', {
    left: i18n('softkey-close'),
    onKeyLeft: () => close(),
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyArrowLeft: scrollLeft,
    onKeyArrowRight: scrollRight
  })

  return (
    <div class='table' ref={containerRef}>
      <table dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  )
}
