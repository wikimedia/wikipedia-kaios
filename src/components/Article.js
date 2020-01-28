import { h, Fragment } from 'preact'
import { memo } from 'preact/compat'
import { useState, useRef, useEffect } from 'preact/hooks'
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

const ArticleSection = ({
  lang, imageUrl, title, description, hasActions, isFooter,
  content, page, showToc, goToSubpage, references,
  hasInfobox, articleTitle, suggestedArticles, showQuickFacts,
  showGallery
}) => {
  const contentRef = useRef()
  const i18n = useI18n()
  const [showReferencePreview] = usePopup(ReferencePreview)
  const [textSize] = useArticleTextSize('Article')

  const linkHandlers = {
    action: ({ action }) => {
      if (action === 'quickfacts') {
        showQuickFacts()
      } else if (action === 'sections') {
        showToc()
      } else if (action === 'gallery') {
        showGallery()
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

  return (
    <div class='article-section' ref={contentRef}>
      { imageUrl && <div class='lead-image' style={{ backgroundImage: `url(${imageUrl})` }} /> }
      <div class={'card' + (imageUrl ? ' with-image' : '')}>
        <div class='title adjustable-font-size' dangerouslySetInnerHTML={{ __html: title }} />
        { description && (
          <Fragment>
            <div class='desc adjustable-font-size'>{description}</div>
            <div class='line' />
          </Fragment>
        ) }
        { hasActions && (
          <div class='article-actions'>
            <div class='article-actions-button' data-action='sections'>
              <img src='images/sections.svg' /><br />
              <label>{i18n.i18n('article-action-sections')}</label>
            </div>
            { hasInfobox && (
              <div class='article-actions-button' data-action='quickfacts'>
                <img src='images/quickfacts.svg' /><br />
                <label>{i18n.i18n('article-action-quickfacts')}</label>
              </div>
            ) }
            <div class='article-actions-button' data-action='gallery'>
              <img src='images/sections.svg' /><br />
              <label>Gallery</label>
            </div>
          </div>
        ) }
        { isFooter
          ? <ArticleFooter lang={lang} title={articleTitle} items={suggestedArticles} />
          : <ArticleBody content={content} />
        }
      </div>
    </div>
  )
}

const ArticleInner = ({ lang, articleTitle, initialSubTitle }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const [article, loadArticle] = useArticle(lang, articleTitle)

  if (!article) {
    return <Loading message={i18n.i18n('article-loading-message')} />
  }

  if (article.error) {
    return <Error message={i18n.i18n('article-error-message')} onRefresh={loadArticle} />
  }

  const [subTitle, setSubTitle] = useState(initialSubTitle)
  const [showTocPopup] = usePopup(ArticleToc, { mode: 'fullscreen' })
  const [showQuickFactsPopup] = usePopup(QuickFacts, { mode: 'fullscreen' })
  const [showLanguagePopup] = usePopup(ArticleLanguage, { mode: 'fullscreen' })
  const [showMenuPopup] = usePopup(ArticleMenu, { mode: 'fullscreen' })
  const [showGalleryPopup] = usePopup(Gallery, { mode: 'fullscreen' })
  const [currentSection, setCurrentSection, currentPage] = useArticlePagination(containerRef, article, subTitle)
  const section = article.sections[currentSection]
  const goToArticleSubpage = ({ sectionIndex, title }) => {
    setCurrentSection(
      sectionIndex !== undefined
        ? sectionIndex
        : article.toc.find(item => item.line === title).sectionIndex
    )
    setSubTitle(title)
    goto.article(lang, [articleTitle, title], true)
  }

  const showArticleTocPopup = () => {
    const currentTitle = findCurrentLocatedTitleOrSubtitle(containerRef)
    showTocPopup({ items: article.toc, currentTitle, onSelectItem: goToArticleSubpage })
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

  return (
    <div class={'article' + (section.isFooter ? ' footer' : '')} ref={containerRef}>
      <ArticleSection
        key={currentSection}
        lang={lang}
        {...section}
        articleTitle={articleTitle}
        hasActions={currentSection === 0}
        hasInfobox={!!article.infobox}
        references={article.references}
        suggestedArticles={article.suggestedArticles}
        showToc={showArticleTocPopup}
        showQuickFacts={showQuickFacts}
        showGallery={showGallery}
        goToSubpage={goToArticleSubpage}
        page={currentPage}
      />
    </div>
  )
}

export const Article = ({ lang, title: articleTitle, subtitle: initialSubTitle }) => {
  return (
    <ArticleInner lang={lang} articleTitle={articleTitle} initialSubTitle={initialSubTitle} key={lang + articleTitle} />
  )
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
