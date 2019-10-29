import { h, Fragment } from 'preact'
import { useRef } from 'preact/hooks'
import { useScroll } from 'hooks/useScroll'

export const ArticleHeader = ({
  imageUrl,
  title,
  description,
  preview,
  content
}) => {
  const hasImage = !!imageUrl
  const contentRef = useRef()
  const step = 240

  useScroll(contentRef, step)

  return (
    <div class='page article' ref={contentRef}>
      <div class='article-header'>
        { hasImage ? <div class='lead-image' style={{ backgroundImage: `url(${imageUrl})` }} /> : '' }
        <div class={'card' + (hasImage ? ' with-image' : '')}>
          <div class='title' dangerouslySetInnerHTML={{ __html: title }} />
          { description ? (
            <Fragment>
              <div class='desc'>{description}</div>
              <div class='line' />
            </Fragment>
          ) : '' }
          <div
            class='article-content'
            dangerouslySetInnerHTML={{ __html: content }}
          />
        </div>
      </div>
    </div>
  )
}
