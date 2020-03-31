import { h } from 'preact'
import { useRef } from 'preact/hooks'
import { useI18n, useSoftkey, useArticleLinksNavigation, useArticleTextSize } from 'hooks'

export const ReferencePreview = ({ reference, lang, close }) => {
  const i18n = useI18n()
  const contentRef = useRef()
  useArticleLinksNavigation('ReferencePreview', lang, contentRef)
  useSoftkey('ReferencePreview', {
    left: i18n('softkey-close'),
    onKeyLeft: close
  }, [])
  useArticleTextSize('ReferencePreview')

  return (
    <div class='reference-preview adjustable-font-size' ref={contentRef}>
      <div class='ref-title'>{i18n('reference-title', reference.number)}</div>
      <div class='ref-content' dangerouslySetInnerHTML={{ __html: reference.content }} />
    </div>
  )
}
