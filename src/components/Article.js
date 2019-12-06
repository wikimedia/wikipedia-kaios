import { h, Fragment } from 'preact'
import { memo } from 'preact/compat'
import { useRef, useEffect } from 'preact/hooks'
import { useArticle, useNavigation, useI18n, useSoftkey, usePagination } from 'hooks'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions, content
}) => {
  const i18n = useI18n()
  const softkey = useSoftkey()
  const actionsRef = useRef()
  const [, setNavigation, getCurrent] = useNavigation(actionsRef, 'x')

  useEffect(() => {
    softkey.dispatch({ type: 'setOnKeyCenter', event: onKeyCenter })
  }, [])

  useEffect(() => {
    // todo: the enter key should only be available on the
    // first page of the first section
    softkey.dispatch({
      type: 'setCenterText',
      value: hasActions ? i18n.i18n('centerkey-select') : ''
    })
    if (hasActions) {
      setNavigation(0)
    }
  }, [hasActions])

  const onKeyCenter = () => {
    const current = getCurrent()
    if (current && (current.key === 'quickfacts')) {
      goToQuickFacts()
    }
  }
  const goToQuickFacts = () => {
    window.location.hash = `/quickfacts/${lang}/${title}`
  }

  return (
    <Fragment>
      { imageUrl && <div class='lead-image' style={{ backgroundImage: `url(${imageUrl})` }} /> }
      <div class={'card' + (imageUrl ? ' with-image' : '')}>
        <div class='title' dangerouslySetInnerHTML={{ __html: title }} />
        { description && (
          <Fragment>
            <div class='desc'>{description}</div>
            <div class='line' />
          </Fragment>
        ) }
        { hasActions && (
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
        ) }
        <ArticleBody content={content} />
      </div>
    </Fragment>
  )
}

export const Article = ({ lang, title }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const article = useArticle(lang, title)
  const softkey = useSoftkey()

  if (!article) {
    return 'Loading...'
  }

  const [currentSection] = usePagination(containerRef, 240, 'x', article.sections.length)
  const section = article.sections[currentSection]

  useEffect(() => {
    softkey.dispatch({ type: 'setLeftText', value: i18n.i18n('close') })
    softkey.dispatch({ type: 'setOnKeyLeft', event: onKeyLeft })
  }, [])

  const onKeyLeft = () => {
    history.back()
  }

  return (
    <div class='page pages-container' ref={containerRef}>
      <div class='pages article'>
        <ArticleSection
          lang={lang}
          title={section.title}
          description={section.description}
          imageUrl={section.imageUrl}
          hasActions={currentSection === 0}
          content={section.content}
        />
      </div>
    </div>
  )
}
