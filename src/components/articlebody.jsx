import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useScroll } from 'hooks/useScroll'

export const ArticleBody = ({
  content
}) => {
  const contentRef = useRef()
  const step = 20

  useScroll(contentRef, step)

  return (
    <div
      class='page article-content'
      ref={contentRef}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
}
