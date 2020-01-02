import { h, Fragment } from 'preact'
import { route } from 'preact-router'
import { memo } from 'preact/compat'
import { useState, useRef, useEffect } from 'preact/hooks'
import {
  ReferencePreview, ArticleToc, ArticleLanguage,
  ArticleMenu
} from 'components'
import {
  useArticle, useI18n, useSoftkey,
  useArticlePagination, useArticleLinksNavigation,
  usePopup
} from 'hooks'
import { articleHistory, confirmDialog, viewport } from 'utils'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions,
  content, page, showToc, goToSubpage, references
}) => {
  const contentRef = useRef()

  const [showReferencePreview] = usePopup(ReferencePreview, { position: 'auto' })

  const linkHandlers = {
    action: ({ action }) => {
      if (action === 'quickfacts') {
        route(`/quickfacts/${lang}/${title}`)
      } else if (action === 'sections') {
        showToc()
      }
    },
    reference: ({ referenceId }) => {
      showReferencePreview({ reference: references[referenceId], lang })
    },
    goto: ({ anchor }) => {
      // @todo styling to be confirmed with design
      confirmDialog({ message: `Go to Section "${anchor}"?`, onSubmit: () => goToSubpage({ title: anchor }) })
    }
  }

  useArticleLinksNavigation('Article', lang, contentRef, page, linkHandlers)

  return (
    <div class='article-section' ref={contentRef}>
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

  const [subTitle, setSubTitle] = useState(initialSubTitle)
  const [showTocPopup] = usePopup(ArticleToc, { mode: 'fullscreen' })
  const [showLanguagePopup] = usePopup(ArticleLanguage, { mode: 'fullscreen' })
  const [showMenuPopup] = usePopup(ArticleMenu, { mode: 'fullscreen' })
  const [currentSection, setCurrentSection, currentPage] = useArticlePagination(containerRef, article, subTitle)
  const section = article.sections[currentSection]

  const goToArticleSubpage = ({ sectionIndex, title }) => {
    setCurrentSection(
      sectionIndex !== undefined
        ? sectionIndex
        : article.toc.find(item => item.line === title).sectionIndex
    )
    setSubTitle(title)
    route(`/article/${lang}/${articleTitle}/${title}`, true)
  }

  const showArticleTocPopup = () => {
    const currentTitle = findCurrentLocatedTitleOrSubtitle(containerRef)
    showTocPopup({ items: article.toc, currentTitle, onSelectItem: goToArticleSubpage })
  }

  const showArticleLanguagePopup = () => {
    showLanguagePopup({ lang, title: articleTitle })
  }

  useSoftkey('Article', {
    left: i18n.i18n('softkey-menu'),
    onKeyLeft: () => showMenuPopup({ onTocSelected: showArticleTocPopup, onLanguageSelected: showArticleLanguagePopup }),
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => history.back()
  }, [])

  useEffect(() => {
    articleHistory.add(lang, articleTitle)
  }, [])

  return (
    <div class='article' ref={containerRef}>
      <ArticleSection
        key={currentSection}
        lang={lang}
        title={section.title}
        description={section.description}
        imageUrl={section.imageUrl}
        hasActions={currentSection === 0}
        content={section.content}
        references={article.references}
        showToc={showArticleTocPopup}
        goToSubpage={goToArticleSubpage}
        page={currentPage}
      />
    </div>
  )
}

export const Article = ({ lang, title: articleTitle, subtitle: initialSubTitle }) => {
  return <ArticleInner lang={lang} articleTitle={articleTitle} initialSubTitle={initialSubTitle} key={lang + articleTitle} />
}

const findCurrentLocatedTitleOrSubtitle = ref => {
  let element
  Array.from(ref.current.querySelectorAll('.title, h3, h4'))
    .find(ref => {
      if (ref.getBoundingClientRect().left < viewport.width) {
        element = ref
      }
    })
  return element.textContent
}
