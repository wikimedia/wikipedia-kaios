import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { ReferencePreview } from 'components'
import {
  useArticle, useScroll, usePopup,
  useI18n, useSoftkey, useArticleLinksNavigation
} from 'hooks'

export const QuickFacts = ({ lang, title }) => {
  const i18n = useI18n()
  const article = useArticle(lang, title)
  const containerRef = useRef()
  const [scrollDown, scrollUp, scrollPosition] = useScroll(containerRef, 20, 'y')
  const [showReferencePreview] = usePopup(ReferencePreview, { position: 'auto' })
  useSoftkey('QuickFacts', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: () => history.back(),
    onKeyArrowDown: scrollDown,
    onKeyArrowUp: scrollUp
  })

  if (!article) {
    return 'Loading...'
  }

  const linkHandlers = {
    reference: ({ referenceId }) => {
      showReferencePreview({ reference: article.references[referenceId], lang })
    }
  }
  useArticleLinksNavigation('QuickFacts', lang, containerRef, linkHandlers, [scrollPosition])

  return (
    <div
      class='quickfacts'
      ref={containerRef}
      dangerouslySetInnerHTML={{ __html: article.infobox }}
    />
  )
}
