import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { ReferencePreview, Gallery } from 'components'
import {
  useScroll, usePopup, useArticleTextSize,
  useI18n, useSoftkey, useArticleLinksNavigation
} from 'hooks'
import { confirmDialog } from 'utils'

export const QuickFacts = ({ article, goToArticleSubpage, close, closeAll }) => {
  const i18n = useI18n()
  const containerRef = useRef()
  const [scrollDown, scrollUp, scrollPosition] = useScroll(containerRef, 20, 'y')
  const [showReferencePreview] = usePopup(ReferencePreview, { stack: true })
  const [showGalleryPopup] = usePopup(Gallery, { mode: 'fullscreen', stack: true })
  const [textSize] = useArticleTextSize('QuickFacts')
  useSoftkey('QuickFacts', {
    left: i18n('softkey-close'),
    onKeyLeft: closeAll,
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp,
    onKeyBackspace: close
  })

  const linkHandlers = {
    reference: ({ referenceId }) => {
      showReferencePreview({
        reference: article.references[referenceId],
        lang: article.contentLang
      })
    },
    section: ({ text, anchor }) => {
      // @todo styling to be confirmed with design
      confirmDialog({ message: i18n('confirm-section', text), onSubmit: () => goToArticleSubpage({ anchor }) })
    },
    image: ({ fileName }) => {
      showGalleryPopup({ items: article.media, startFileName: fileName, lang: article.contentLang })
    }
  }

  useArticleLinksNavigation(
    'QuickFacts',
    article.contentLang,
    containerRef,
    linkHandlers,
    [scrollPosition, textSize]
  )

  return (
    <div
      class='quickfacts adjustable-font-size'
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: article.infobox }}
    />
  )
}
