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
  const step = 20

  useScroll(contentRef, step)

  return (
    <div class='page article-header' ref={contentRef}>
      { hasImage ? <img src={imageUrl} /> : '' }
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
  )
}
