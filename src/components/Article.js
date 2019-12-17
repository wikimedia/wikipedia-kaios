import { h, Fragment } from 'preact'
import { route } from 'preact-router'
import { memo } from 'preact/compat'
import { useState, useRef } from 'preact/hooks'
import { ArticlePreview, ArticleToc } from 'components'
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

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions, content, page, showToc
}) => {
  const i18n = useI18n()
  const contentRef = useRef()
  const [articlePreview, setArticlePreview] = useState()

  const onTitleClick = title => {
    setArticlePreview(title)
  }
  const onActionClick = action => {
    if (action === 'quickfacts') {
      window.location.hash = `/quickfacts/${lang}/${title}`
    } else if (action === 'sections') {
      showToc()
    }
  }
  const [selectedLink] = useArticleLinksNavigation(
    contentRef, page, onTitleClick, onActionClick)

  useSoftkey('Article', {
    center: selectedLink ? i18n.i18n('centerkey-select') : ''
  }, [selectedLink])

  return (
    <div class='article-section' ref={contentRef}>
      { articlePreview && <ArticlePreview close={() => setArticlePreview(null)} title={articlePreview} lang={lang} />}
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
              <img src='images/sections.svg' /><br />
              <label>Sections</label>
            </div>
            <div class='article-actions-button' data-action='quickfacts'>
              <img src='images/quickfacts.svg' /><br />
              <label>Quick Facts</label>
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
      <div class='article' ref={containerRef}>
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
    </Fragment>
  )
}

export const Article = ({ lang, title: articleTitle, subtitle: initialSubTitle }) => {
  return <ArticleInner lang={lang} articleTitle={articleTitle} initialSubTitle={initialSubTitle} key={lang + articleTitle} />
}
