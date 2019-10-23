import { h, Fragment } from 'preact'

export const ArticleHeader = ({
  imageUrl,
  title,
  description,
  preview
}) => {
  const hasImage = !!imageUrl
  return (
    <div class='article'>
      { hasImage ? <img src={imageUrl} /> : '' }
      <div class={'card' + (hasImage ? ' with-image' : '')}>
        <div class='title' dangerouslySetInnerHTML={{ __html: title }} />
        { description ? (
          <Fragment>
            <div class='desc'>{description}</div>
            <div class='line' />
          </Fragment>
        ) : '' }
        { hasImage ? '' : <div class='preview' dangerouslySetInnerHTML={{ __html: preview }} /> }
      </div>
    </div>
  )
}
