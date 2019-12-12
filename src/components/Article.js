import { h, Fragment } from 'preact'
import { route } from 'preact-router'
import { memo } from 'preact/compat'
import { useState, useRef } from 'preact/hooks'
import { ArticleToc } from 'components'
import {
  useArticle, useI18n, useSoftkey,
  useArticlePagination, useArticleLinksNavigation
} from 'hooks'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleAudioPopup = ({ closeFn }) => {
  useSoftkey('ArticleAudioPopup', {
    center: 'ClosePopup',
    onKeyCenter: closeFn
  }, [])
  const style = {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: '30px',
    top: 100,
    backgroundColor: 'pink',
    zIndex: 999
  }
  return (
    <div class='popup' style={style}>
      <h1>This is a popup on top of the article page</h1>
    </div>
  )
}

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions, content, page, showToc
}) => {
  const i18n = useI18n()
  const [isAudioPopupVisible, setAudioPopupVisible] = useState(false)
  const contentRef = useRef()

  const onTitleClick = title => {
    // todo: show a preview with an option to read more
    route(`/article/${lang}/${title}`, true)
  }
  const onActionClick = action => {
    if (action === 'quickfacts') {
      window.location.hash = `/quickfacts/${lang}/${title}`
    } else if (action === 'sections') {
      showToc()
    } else if (action === 'audio') {
      setAudioPopupVisible(true)
    }
  }
  const [selectedLink] = useArticleLinksNavigation(
    contentRef, page, onTitleClick, onActionClick)

  useSoftkey('Article', {
    center: selectedLink ? i18n.i18n('centerkey-select') : ''
  }, [selectedLink])

  return (
    <div class='article-section' ref={contentRef}>
      { isAudioPopupVisible && <ArticleAudioPopup closeFn={() => setAudioPopupVisible(false)} />}
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
          <div class='article-actions'>
            <div class='article-actions-button' data-action='sections'>
              <img src='images/sections.svg' />
              <label>Sections</label>
            </div>
            <div class='article-actions-button' data-action='quickfacts'>
              <img src='images/quickfacts.svg' />
              <label>Quick Facts</label>
            </div>
            <div class='article-actions-button' data-action='audio'>
              <img src='images/audio.svg' />
              <label>Audio</label>
            </div>
          </div>
        ) }
        <ArticleBody content={content} />
      </div>
    </div>
  )
}

const ArticleInner = ({ lang, articleTitle, initialSubTitle }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const article = useArticle(lang, articleTitle)

  if (!article) {
    return 'Loading...'
  }

  const [isTocShown, toggleToc] = useState(false)
  const [subTitle, setSubTitle] = useState(initialSubTitle)
  const [currentSection, setCurrentSection, currentPage] = useArticlePagination(containerRef, article, subTitle)
  const section = article.sections[currentSection]

  useSoftkey('Article', {
    left: i18n.i18n('close'),
    onKeyLeft: () => history.back(),
    right: i18n.i18n('sections'),
    onKeyRight: () => toggleToc(true)
  }, [])

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
      { isTocShown && <ArticleToc items={article.toc} close={goToArticleSubpage} /> }
      <div class='page pages-container' ref={containerRef}>
        <div class='pages article'>
          <ArticleSection
            key={currentSection}
            lang={lang}
            title={section.title}
            description={section.description}
            imageUrl={section.imageUrl}
            hasActions={currentSection === 0}
            content={section.content}
            showToc={() => toggleToc(true)}
            page={currentPage}
          />
        </div>
      </div>
    </Fragment>
  )
}

export const Article = ({ lang, title: articleTitle, subtitle: initialSubTitle }) => {
  return <ArticleInner lang={lang} articleTitle={articleTitle} initialSubTitle={initialSubTitle} key={lang + articleTitle + articleTitle} />
}
