import { h, Fragment } from 'preact'
import { memo } from 'preact/compat'
import { useState, useRef, useEffect, useLayoutEffect, useContext } from 'preact/hooks'
import {
  ReferencePreview, ArticleToc, ArticleLanguage,
  ArticleMenu, ArticleFooter, ArticleLoading, QuickFacts,
  Error, Gallery, Table
} from 'components'
import {
  useArticle, useI18n, useSoftkey,
  useArticlePagination, useArticleLinksNavigation,
  usePopup, useTracking
} from 'hooks'
import { articleHistory, confirmDialog, goto, viewport, buildWpMobileWebUrl } from 'utils'
import { FontContext } from 'contexts'

const ArticleBody = memo(({ content }) => {
  return (
    <div
      class='article-content'
      dangerouslySetInnerHTML={{ __html: content }}
    />
  )
})

const ArticleActions = ({ actions, lang }) => {
  const contentI18n = useI18n(lang)
  return (
    <div class='article-actions'>
      { actions.filter(a => a.enabled).map(action => (
        <div class='article-actions-button' data-action={action.name} key={action.name}>
          <img src={`images/icon-${action.name}.svg`} />
          <label>{contentI18n(`article-action-${action.name}`)}</label>
        </div>
      )) }
    </div>
  )
}

const ArticleSection = ({
  lang, dir, imageUrl, anchor, title, description, actions,
  isFooter, content, page, goToSubpage, references,
  articleTitle, suggestedArticles, showGallery,
  galleryItems, namespace, id
}) => {
  const contentRef = useRef()
  const i18n = useI18n()
  const [showReferencePreview] = usePopup(ReferencePreview)
  const [showTable] = usePopup(Table, { mode: 'fullscreen' })
  const { textSize } = useContext(FontContext)
  const linkHandlers = {
    action: ({ action }) => {
      const targetAction = actions.find(a => a.name === action)
      if (targetAction) {
        targetAction.handler()
      }
    },
    reference: ({ referenceId }) => {
      if (references[referenceId]) {
        showReferencePreview({ reference: references[referenceId], lang, dir })
      }
    },
    section: ({ text, anchor }) => {
      // @todo styling to be confirmed with design
      confirmDialog({ message: i18n('confirm-section', text), dir, onSubmit: () => goToSubpage({ anchor }) })
    },
    image: ({ fileName }) => {
      showGallery(fileName)
    },
    table: ({ content }) => {
      showTable({ content, dir })
    }
  }

  useArticleLinksNavigation('Article', lang, contentRef, linkHandlers, [page, textSize], { galleryItems, articleTitle, namespace, id })

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
      introHeight += 21 // Magic number needed to make it work
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
      <div class='card' dir={dir}>
        <div class='intro'>
          <div class='title' data-anchor={anchor} dangerouslySetInnerHTML={{ __html: title }} />
          { description && (
            <Fragment>
              <div class='desc'>{description}</div>
            </Fragment>
          ) }
          { actions && <ArticleActions actions={actions} lang={lang} /> }
          { imageUrl && (
            <div class='indicator'>
              <img src='images/icon-down-arrow.svg' />
            </div>
          ) }
        </div>
        { isFooter
          ? <ArticleFooter lang={lang} title={articleTitle} items={suggestedArticles} dir={dir} />
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
    return <ArticleLoading />
  }

  if (article.error) {
    return <Error message={i18n('article-error-message')} onRefresh={loadArticle} />
  }

  const dir = article.dir
  const sectionCount = article.toc.filter(s => s.level === 1).length
  const [openedSections, setOpenedSections] = useState({})
  useTracking('Article', lang, article.namespace, sectionCount, openedSections)
  const [anchor, setAnchor] = useState(initialAnchor)
  const [showTocPopup] = usePopup(ArticleToc, { mode: 'fullscreen', stack: true })
  const [showQuickFactsPopup] = usePopup(QuickFacts, { mode: 'fullscreen', stack: true })
  const [showLanguagePopup] = usePopup(ArticleLanguage, { mode: 'fullscreen', stack: true })
  const [showMenuPopup] = usePopup(ArticleMenu)
  const [showGalleryPopup] = usePopup(Gallery, { mode: 'fullscreen', stack: true })
  const [currentSection, setCurrentSection, currentPage] = useArticlePagination(containerRef, article, anchor)
  const section = article.sections[currentSection]
  const sharedEnabled = !!window.MozActivity // disabled on browsers (not supported)
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
    showQuickFactsPopup({ article, goToArticleSubpage, dir })
  }

  const showGallery = startFileName => {
    showGalleryPopup({ items: article.media, startFileName, lang, dir })
  }

  const shareArticleUrl = () => {
    // eslint-disable-next-line no-new
    new window.MozActivity({
      name: 'share',
      data: {
        type: 'url',
        url: buildWpMobileWebUrl(lang, articleTitle)
      }
    })
  }

  const showArticleMenu = () => {
    showMenuPopup({
      onTocSelected: showArticleTocPopup,
      onLanguageSelected: showArticleLanguagePopup,
      onQuickFactsSelected: showQuickFacts,
      onGallerySelected: showGallery,
      onShareArticleUrl: shareArticleUrl,
      hasInfobox: !!article.infobox,
      hasLanguages: article.languageCount,
      hasGallery: !!article.media.length,
      isShareEnabled: sharedEnabled
    })
  }

  const onKeyBackspace = () => {
    if (articleHistory.hasPrev()) {
      const { lang, title } = articleHistory.prev()
      goto.article(lang, title, true)
    } else {
      goto.back()
    }
  }

  useSoftkey('Article', {
    left: i18n('softkey-close'),
    onKeyLeft: () => goto.back(),
    right: i18n('softkey-menu'),
    onKeyRight: showArticleMenu,
    onKeyBackspace
  }, [])

  useEffect(() => {
    articleHistory.add(lang, articleTitle)
  }, [])

  useEffect(() => {
    if (currentSection !== 0) { // lead section doesn't count
      const anchor = article.sections[currentSection].anchor
      setOpenedSections({ ...openedSections, [anchor]: true })
    }
  }, [currentSection])

  const actions = currentSection === 0 ? [
    { name: 'sections', enabled: true, handler: showArticleTocPopup },
    { name: 'gallery', enabled: !!article.media.length, handler: showGallery },
    { name: 'languages', enabled: article.languageCount, handler: showArticleLanguagePopup },
    { name: 'share', enabled: sharedEnabled, handler: shareArticleUrl }
  ] : null

  return (
    <div class={'article' + (section.isFooter ? ' footer' : '')} ref={containerRef} dir='ltr'>
      <ArticleSection
        key={currentSection}
        lang={lang}
        dir={dir}
        {...section}
        articleTitle={articleTitle}
        actions={actions}
        references={article.references}
        suggestedArticles={article.suggestedArticles}
        goToSubpage={goToArticleSubpage}
        showGallery={showGallery}
        galleryItems={article.media}
        namespace={article.namespace}
        id={article.id}
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
      if (ref.getBoundingClientRect().left < viewport().width) {
        element = ref
      }
    })
  return element.getAttribute('data-anchor') || element.id
}
