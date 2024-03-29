import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { ReferencePreview, Gallery } from 'components'
import {
  useScroll, usePopup, useConfirmDialog,
  useI18n, useSoftkey, useArticleLinksNavigation
} from 'hooks'

export const QuickFacts = ({ article, goToArticleSubpage, dir, close, closeAll }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const [scrollDown, scrollUp, scrollPosition] = useScroll(containerRef, 20, 'y')
  const [showReferencePreview] = usePopup(ReferencePreview, { stack: true })
  const [showGalleryPopup] = usePopup(Gallery, { mode: 'fullscreen', stack: true })
  const showSectionConfirmDialog = useConfirmDialog()
  const source = { galleryItems: article.media, articleTitle: article.title, namespace: article.namespace, id: article.id }
  useSoftkey('QuickFacts', {
    left: i18n('softkey-close'),
    onKeyLeft: closeAll,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyBackspace: close
  })

  const linkHandlers = {
    reference: ({ referenceId }) => {
      if (article.references[referenceId]) {
        showReferencePreview({
          reference: article.references[referenceId],
          lang: article.contentLang,
          dir
        })
      }
    },
    section: ({ text, anchor }) => {
      // @todo styling to be confirmed with design
      showSectionConfirmDialog({ message: i18n('confirm-section', text), dir, onSubmit: () => goToArticleSubpage({ anchor }) })
    },
    image: ({ fileName }) => {
      showGalleryPopup({ items: article.media, startFileName: fileName, lang: article.contentLang, dir })
    }
  }

  useArticleLinksNavigation(
    'QuickFacts',
    article.contentLang,
    containerRef,
    linkHandlers,
    [scrollPosition],
    source
  )

  return (
    <div
      class='quickfacts'
      dir={dir}
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: article.infobox }}
    />
  )
}
