import { h } from 'preact'
import { useRef, useLayoutEffect } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation } from 'hooks'
import { ArticleTextSize } from 'utils'

export const ReferencePreview = ({ reference, lang, close }) => {
  const i18n = useI18n()
  const contentRef = useRef()
  useArticleLinksNavigation('ReferencePreview', lang, contentRef, 1)
  useSoftkey('ReferencePreview', {
    right: i18n.i18n('softkey-close'),
    onKeyRight: close,
    ...ArticleTextSize.getSoftkeyEffect()
  }, [])

  useLayoutEffect(() => {
    ArticleTextSize.init('.reference-preview')
  }, [])

  return (
    <div class='reference-preview' ref={contentRef}>
      <div class='ref-title'>{i18n.i18n('reference-title', reference.number)}</div>
      <div class='ref-content' dangerouslySetInnerHTML={{ __html: reference.content }} />
    </div>
  )
}
