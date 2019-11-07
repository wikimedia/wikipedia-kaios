import { h, Fragment } from 'preact'
import { useRef, useEffect } from 'preact/hooks'
import { Pager, Softkey } from 'components'
import { useArticle, useBackToSearch, useNavigation, useI18n } from 'hooks'

export const Article = ({ lang, title }) => {
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const actionsRef = useRef()
  useBackToSearch()
  const [, setNavigation, getCurrent] = useNavigation(actionsRef, 'x')

  useEffect(() => {
    setNavigation(0)
  }, [article])

  const onKeyCenter = () => {
    const current = getCurrent()
    if (current.key === 'quickfacts') {
      goToQuickFacts()
    }
  }
  const goToQuickFacts = () => {
    window.location.hash = `/quickfacts/${lang}/${title}`
  }

  if (!article) {
    return 'Loading...'
  }

  const hasImage = !!article.imageUrl

  return (
    <Fragment>
      <Pager>
        <div class='page article'>
          { hasImage && <div class='lead-image' style={{ backgroundImage: `url(${article.imageUrl})` }} /> }
          <div class={'card' + (hasImage ? ' with-image' : '')}>
            <div class='title' dangerouslySetInnerHTML={{ __html: article.title }} />
            { article.description && (
              <Fragment>
                <div class='desc'>{article.description}</div>
                <div class='line' />
              </Fragment>
            ) }
            <div class='article-actions' ref={actionsRef}>
              <div class='article-actions-button' data-selectable data-selected-key='sections'>
                <img src='images/sections.svg' />
                <label>Sections</label>
              </div>
              <div class='article-actions-button' data-selectable data-selected-key='quickfacts'>
                <img src='images/quickfacts.svg' />
                <label>Quick Facts</label>
              </div>
              <div class='article-actions-button' data-selectable data-selected-key='audio'>
                <img src='images/audio.svg' />
                <label>Audio</label>
              </div>
            </div>
            <div
              class='article-content'
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </div>
      </Pager>
      <Softkey
        left='Settings'
        center={i18n.i18n('centerkey-select')}
        onKeyCenter={onKeyCenter}
      />
    </Fragment>
  )
}
