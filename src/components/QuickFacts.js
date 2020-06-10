import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { ReferencePreview, Gallery } from 'components'
import {
  useScroll, usePopup, useArticleTextSize,
  useI18n, useSoftkey, useArticleLinksNavigation
} from 'hooks'
import { confirmDialog } from 'utils'

export const QuickFacts = ({ article, goToArticleSubpage, close, closeAll, rtl }) => {
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
      if (article.references[referenceId]) {
        showReferencePreview({
          reference: article.references[referenceId],
          lang: article.contentLang,
          rtl
        })
      }
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
    { lang: article.contentLang, rtl },
    containerRef,
    linkHandlers,
    [scrollPosition, textSize],
    article.media
  )

  useLayoutEffect(() => {
    if (rtl) {
      containerRef.current.style.direction = 'rtl'
    }
  }, [])

  return (
    <div
      class='quickfacts adjustable-font-size'
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: article.infobox }}
    />
  )
}
