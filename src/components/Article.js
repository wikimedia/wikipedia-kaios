import { h, Fragment } from 'preact'
import { memo } from 'preact/compat'
import { useState, useRef, useEffect, useLayoutEffect } from 'preact/hooks'
import {
  ReferencePreview, ArticleToc, ArticleLanguage,
  ArticleMenu, ArticleFooter, Loading, QuickFacts,
  Error, Gallery
} from 'components'
import {
  useArticle, useI18n, useSoftkey,
  useArticlePagination, useArticleLinksNavigation, useArticleTextSize,
  usePopup
} from 'hooks'
import { articleHistory, confirmDialog, goto, viewport } from 'utils'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content adjustable-font-size'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleActions = ({ actions }) => {
  const i18n = useI18n()
  return (
    <div class='article-actions'>
      { actions.filter(a => a.enabled).map(action => (
        <div class='article-actions-button' data-action={action.name} key={action.name}>
          <img src={`images/icon-${action.name}.svg`} />
          <label>{i18n.i18n(`article-action-${action.name}`)}</label>
        </div>
      )) }
    </div>
  )
}

const ArticleSection = ({
  lang, imageUrl, anchor, title, description, actions, isFooter,
  content, page, goToSubpage, references,
  articleTitle, suggestedArticles
}) => {
  const contentRef = useRef()
  const i18n = useI18n()
  const [showReferencePreview] = usePopup(ReferencePreview)
  const [textSize] = useArticleTextSize('Article')

  const linkHandlers = {
    action: ({ action }) => {
      const targetAction = actions.find(a => a.name === action)
      if (targetAction) {
        targetAction.handler()
      }
    },
    reference: ({ referenceId }) => {
      showReferencePreview({ reference: references[referenceId], lang })
    },
    section: ({ text, anchor }) => {
      // @todo styling to be confirmed with design
      confirmDialog({ message: i18n.i18n('confirm-section', text), onSubmit: () => goToSubpage({ title: anchor }) })
    }
  }

  useArticleLinksNavigation('Article', lang, contentRef, linkHandlers, [page, textSize])

  useLayoutEffect(() => {
    if (!contentRef.current) {
      return
    }
    const MAX_TITLE_HEIGHT = 140
    const titleNode = contentRef.current.querySelector('.title')
    if (titleNode.getBoundingClientRect().height > MAX_TITLE_HEIGHT) {
      titleNode.classList.add('clamp')
    }
    if (imageUrl) {
      const cardNode = contentRef.current.querySelector('.card')
      // Ensure .intro is completely visible to calculate its size
      cardNode.style.marginTop = 0

      const introNode = contentRef.current.querySelector('.intro')
      let introHeight = introNode.getBoundingClientRect().height
      introHeight += 34 // Magic number needed to make it work
      const articleSectionHeight = contentRef.current.getBoundingClientRect().height
      const marginTop = articleSectionHeight - introHeight

      cardNode.style.marginTop = `${marginTop}px`
    }
  }, [title, imageUrl, textSize])

  return (
    <div
      class='article-section'
      ref={contentRef}
      style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : {}}>
      <div class='card'>
        <div class='intro'>
          <div class='title adjustable-font-size' data-anchor={anchor} dangerouslySetInnerHTML={{ __html: title }} />
          { description && (
            <Fragment>
              <div class='desc adjustable-font-size'>{description}</div>
            </Fragment>
          ) }
          { actions && <ArticleActions actions={actions} /> }
        </div>
        { isFooter
          ? <ArticleFooter lang={lang} title={articleTitle} items={suggestedArticles} />
          : <ArticleBody content={content} />
        }
      </div>
    </div>
  )
}

const ArticleInner = ({ lang, articleTitle, initialAnchor }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const [article, loadArticle] = useArticle(lang, articleTitle)

  if (!article) {
    return <Loading message={i18n.i18n('article-loading-message')} />
  }

  if (article.error) {
    return <Error message={i18n.i18n('article-error-message')} onRefresh={loadArticle} />
  }

  const [anchor, setAnchor] = useState(initialAnchor)
  const [showTocPopup] = usePopup(ArticleToc, { mode: 'fullscreen' })
  const [showQuickFactsPopup] = usePopup(QuickFacts, { mode: 'fullscreen' })
  const [showLanguagePopup] = usePopup(ArticleLanguage, { mode: 'fullscreen' })
  const [showMenuPopup] = usePopup(ArticleMenu, { mode: 'fullscreen' })
  const [showGalleryPopup] = usePopup(Gallery, { mode: 'fullscreen' })
  const [currentSection, setCurrentSection, currentPage] = useArticlePagination(containerRef, article, anchor)
  const section = article.sections[currentSection]
  const goToArticleSubpage = ({ sectionIndex, anchor }) => {
    setCurrentSection(
      sectionIndex !== undefined
        ? sectionIndex
        : article.toc.find(item => item.anchor === anchor).sectionIndex
    )
    setAnchor(anchor)
    goto.article(lang, [articleTitle, anchor], true)
  }

  const showArticleTocPopup = () => {
    const currentAnchor = findCurrentLocatedAnchor(containerRef)
    showTocPopup({ items: article.toc, currentAnchor, onSelectItem: goToArticleSubpage })
  }

  const showArticleLanguagePopup = () => {
    showLanguagePopup({ lang, title: articleTitle })
  }

  const showQuickFacts = () => {
    showQuickFactsPopup({ article })
  }

  const showArticleMenu = () => {
    showMenuPopup({
      onTocSelected: showArticleTocPopup,
      onLanguageSelected: showArticleLanguagePopup,
      onQuickFactsSelected: showQuickFacts,
      hasInfobox: !!article.infobox,
      hasLanguages: article.languageCount
    })
  }

  const showGallery = () => {
    showGalleryPopup({ items: article.media })
  }

  useSoftkey('Article', {
    left: i18n.i18n('softkey-menu'),
    onKeyLeft: showArticleMenu,
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => history.back()
  }, [])

  useEffect(() => {
    articleHistory.add(lang, articleTitle)
  }, [])

  const actions = currentSection === 0 ? [
    { name: 'sections', enabled: true, handler: showArticleTocPopup },
    { name: 'quickfacts', enabled: !!article.infobox, handler: showQuickFacts },
    { name: 'gallery', enabled: !!article.media.length, handler: showGallery },
    { name: 'languages', enabled: article.languageCount, handler: showArticleLanguagePopup }
  ] : null

  return (
    <div class={'article' + (section.isFooter ? ' footer' : '')} ref={containerRef}>
      <ArticleSection
        key={currentSection}
        lang={lang}
        {...section}
        articleTitle={articleTitle}
        actions={actions}
        references={article.references}
        suggestedArticles={article.suggestedArticles}
        goToSubpage={goToArticleSubpage}
        page={currentPage}
      />
    </div>
  )
}

export const Article = ({ lang, title: articleTitle, anchor: initialAnchor }) => {
  return (
    <ArticleInner lang={lang} articleTitle={articleTitle} initialAnchor={initialAnchor} key={lang + articleTitle} />
  )
}

const findCurrentLocatedAnchor = ref => {
  let element
  Array.from(ref.current.querySelectorAll('.title, h3, h4'))
    .find(ref => {
      if (ref.getBoundingClientRect().left < viewport.width) {
        element = ref
      }
    })
  return element.getAttribute('data-anchor')
}
