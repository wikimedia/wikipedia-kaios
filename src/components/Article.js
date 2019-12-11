import { h, Fragment } from 'preact'
import { route } from 'preact-router'
import { memo } from 'preact/compat'
import { useState, useRef, useEffect } from 'preact/hooks'
import { useArticle, useNavigation, useI18n, useSoftkey, useArticlePagination } from 'hooks'
import { ArticleToc } from 'components'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions, content, showToc
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
    if (current) {
      switch (current.key) {
        case 'quickfacts':
          window.location.hash = `/quickfacts/${lang}/${title}`
          break
        case 'sections':
          showToc()
          break
      }
    }
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

export const Article = ({ lang, title: articleTitle, subtitle: initialSubTitle }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const article = useArticle(lang, articleTitle)
  const softkey = useSoftkey()

  if (!article) {
    return 'Loading...'
  }

  const [showToc, toggleToc] = useState(false)
  const [subTitle, setSubTitle] = useState(initialSubTitle)
  const [currentSection, setCurrentSection] = useArticlePagination(containerRef, article, subTitle, showToc)
  const section = article.sections[currentSection]

  useEffect(() => {
    if (!showToc) {
      softkey.dispatch({ type: 'setLeftText', value: i18n.i18n('close') })
      softkey.dispatch({ type: 'setOnKeyLeft', event: () => history.back() })
      softkey.dispatch({ type: 'setRightText', value: i18n.i18n('sections') })
      softkey.dispatch({ type: 'setOnKeyRight', event: onKeyRight })
    }
  }, [showToc])

  // @todo temporarily section until we have the menu
  const onKeyRight = () => {
    toggleToc(true)
  }

  const goToArticleSubpage = (item) => {
    if (item) {
      const { sectionIndex, title } = item
      setCurrentSection(sectionIndex)
      setSubTitle(title)
      route(`/article/${lang}/${articleTitle}/${title}`, true)
    }
    toggleToc(false)
  }

  return (
    <Fragment>
      { showToc && <ArticleToc items={article.toc} close={goToArticleSubpage} /> }
      <div class='page pages-container' ref={containerRef}>
        <div class='pages article'>
          <ArticleSection
            lang={lang}
            title={section.title}
            description={section.description}
            imageUrl={section.imageUrl}
            hasActions={currentSection === 0}
            content={section.content}
            showToc={() => toggleToc(true)}
          />
        </div>
      </div>
    </Fragment>
  )
}
